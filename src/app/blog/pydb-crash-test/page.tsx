import type { Metadata } from "next";
import Link from "next/link";
import { ArticleLayout, Section, Lead, Code, C, DemoCTA } from "@/components/BlogUI";

export const metadata: Metadata = {
  title: "My database lost every committed write, and one test found it",
  description:
    "PyDB had a write-ahead log, fsync on every commit, and a README that promised crash recovery. The first time I killed it mid-workload, 50 committed rows came back as zero.",
  openGraph: {
    type: "article",
    title: "My database lost every committed write, and one test found it",
    description: "A write-ahead log that replayed the wrong transactions, and the kill -9 test that caught it.",
  },
};

export default function PyDBCrashTest() {
  return (
    <ArticleLayout slug="pydb-crash-test">
      <Lead>
        <p>
          PyDB, the storage engine I built to learn how databases work, had a write-ahead log. Every
          insert wrote a <C>START</C> record, <C>fsync</C>&apos;d it, changed the B-Tree, then wrote
          and <C>fsync</C>&apos;d a <C>COMMIT</C>. The README said it recovered from crashes. I had
          tested it by typing a few inserts and restarting it, and it worked.
        </p>
        <p>
          Then I wrote a test that actually crashed it. Insert 50 rows, each one fully committed,
          then kill the process with no chance to clean up. Restart. Count the rows.
        </p>
        <p>Zero out of fifty.</p>
      </Lead>

      <Section title="What the engine was doing">
        <p>
          Two separate things were wrong, and either one alone would have lost data.
        </p>
        <p>
          The first was where the data lived. The pager kept pages in memory and only wrote them back
          to the data file in <C>close()</C>, which ran when you typed <C>.exit</C>. A process that
          dies never reaches <C>close()</C>. So after a crash the data file held whatever was there at
          the last clean shutdown, and everything since existed only in the log.
        </p>
        <p>
          That would have been fine if recovery replayed the log. It did, just not the right part of
          it:
        </p>
        <Code>{`# the original recovery, simplified
active = {}
for entry in wal:
    if entry["status"] == "START":
        active[entry["txn_id"]] = entry["data"]
    elif entry["status"] == "COMMIT":
        del active[entry["txn_id"]]      # committed: assume it's on disk

for txn in active.values():             # replay only what never committed
    db.insert(txn)`}</Code>
        <p>
          It skipped every committed transaction on the assumption that committed meant
          &ldquo;already in the data file&rdquo;, and redid the uncommitted ones, which should have
          been thrown away. Exactly backwards for a design where the data file lags behind the log.
        </p>
      </Section>

      <Section title="Why &ldquo;log before you apply&rdquo; wasn&apos;t enough">
        <p>
          I had the famous rule right. The log record really was durable before the page changed. But
          a write-ahead log only protects you if the thing you replay it onto is in a known state, and
          if you replay the transactions that the log says happened.
        </p>
        <p>
          There was a third problem hiding behind the first two. Even if I&apos;d flushed pages more
          often, flushing them in place means a crash halfway through can leave half of a B-Tree split
          on disk: the new right-hand page written, the parent that points to it not. Replaying a log
          onto a half-written tree gives you a tree that is wrong in ways that are hard to even detect.
        </p>
      </Section>

      <Section title="The fix: a redo log and atomic checkpoints">
        <p>
          The redesign is small once the rules are clear. Data files only change at a checkpoint, and
          a checkpoint never edits the live file. It writes every page to a new file, <C>fsync</C>s
          it, and renames it over the old one. A rename is atomic, so the data file on disk is always a
          complete tree from some checkpoint, never a mix of two.
        </p>
        <Code>{`def checkpoint(self):
    tmp = self.filename + ".tmp"
    with open(tmp, "wb") as out:
        for page_num in range(self.num_pages):
            out.write(self.get_page(page_num))
        out.flush()
        os.fsync(out.fileno())
    os.replace(tmp, self.filename)       # atomic swap
    fsync_dir(os.path.dirname(self.filename))  # make the rename itself durable`}</Code>
        <p>
          That last line matters more than it looks. The rename is a change to the directory, and a
          directory that hasn&apos;t been synced can come back after a crash still pointing at the old
          file.
        </p>
        <p>
          With the data file only ever holding a checkpoint, recovery becomes simple: take every
          transaction that has a <C>COMMIT</C> record, in order, and redo it. Drop any <C>START</C>{" "}
          without one. Ignore a half-written last line, which is what a crash in the middle of an
          append leaves behind. Then checkpoint, so a second restart has nothing to redo.
        </p>
        <p>
          Replay has to be safe to run twice, because a crash can happen during recovery too. I made
          B-Tree insert replace the value when the key already exists, so redoing an insert that
          already made it into the file changes nothing.
        </p>
      </Section>

      <Section title="Testing it the way it fails">
        <p>
          The test that found the bug is now the main test. A child process inserts rows and prints
          each id only after its <C>COMMIT</C> is <C>fsync</C>&apos;d. The test reads those ids, sends
          it <C>SIGKILL</C> after 1, 40 and 250 acknowledgements, reopens the database and checks two
          things:
        </p>
        <Code>{`# durability: everything the client saw acknowledged is there, through both indexes
for i in range(1, acked + 1):
    assert db.get(i) == expected(i)
    assert db.find_by_email(f"user{i}@example.com") == expected(i)

# atomicity: at most the one in-flight insert beyond that, whole or absent
assert db.get(acked + 1) in (None, expected(acked + 1))
assert db.get(acked + 2) is None`}</Code>
        <p>
          Two more tests kill the process inside the checkpoint itself, once between writing the two
          index files and once after both but before the log is truncated. An environment variable
          turns on an <C>os._exit(1)</C> at exactly that line. All 300 rows have to come back.
        </p>
        <p>
          To check the tests weren&apos;t passing by accident, I broke recovery on purpose (made it
          replay nothing) and ran the suite: 8 of the 20 tests failed, including every crash test.
          Restored, all 20 pass, in CI on every push.
        </p>
      </Section>

      <Section title="What it costs">
        <p>
          Two <C>fsync</C> calls per transaction cap it at about 2,650 inserts a second on my laptop.
          Every checkpoint rewrites the whole file, and the page cache never evicts, so the database has
          to fit in memory. Both are fine for a learning engine and both are written down in the README
          as the next things to fix: dirty-page tracking, and a double-write buffer so pages can be
          written in place safely.
        </p>
        <p>
          And the tests kill a process; they don&apos;t pull the power. On macOS, <C>fsync</C>{" "}
          doesn&apos;t force the drive to empty its own write cache (that needs <C>F_FULLFSYNC</C>), so
          &ldquo;durable&rdquo; here means &ldquo;survives the process dying&rdquo;, and I&apos;d rather
          say that than claim more.
        </p>
        <p>
          The part I keep coming back to: the engine had every piece a textbook asks for, and a README
          that listed them all. It still lost everything, and nothing short of killing it would have
          shown me. The background on the engine itself is in{" "}
          <Link href="/blog/building-pydb" className="text-teal-300 hover:underline">
            building a B-Tree storage engine from scratch
          </Link>
          .
        </p>
      </Section>

      <DemoCTA
        href="https://github.com/AnirudhChandan/PyDB"
        title="Read the code and the tests"
        desc="pydb/db.py has the write path and recovery; tests/test_crash_recovery.py has the kill -9 tests."
        label="PyDB on GitHub"
      />
    </ArticleLayout>
  );
}
