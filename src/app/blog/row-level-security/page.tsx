import type { Metadata } from "next";
import { ArticleLayout, Section, Lead, Code, C } from "@/components/BlogUI";

export const metadata: Metadata = {
  title: "Row-level security: the tenant check you can't forget",
  description:
    "Cross-tenant data leaks come from one missing WHERE clause. PostgreSQL row-level security moves that check into the database, if you avoid the handful of ways it quietly switches itself off.",
  openGraph: {
    type: "article",
    title: "Row-level security: the tenant check you can't forget",
    description: "Moving tenant isolation into PostgreSQL, and the ways row-level security quietly turns itself off.",
  },
};

export default function RowLevelSecurity() {
  return (
    <ArticleLayout slug="row-level-security">
      <Lead>
        <p>
          On a multi-tenant ERP I worked on, I closed a few cross-tenant IDOR holes: endpoints where
          changing an id in the URL returned a record belonging to a different company. Each one was
          the same bug. Someone wrote a query and forgot <C>AND tenant_id = ?</C>.
        </p>
        <p>
          You can fix those one at a time, and add code review, and add tests. The next endpoint
          someone writes still depends on a person remembering. So when I built a multi-tenant
          document platform for a client, I put the check somewhere nobody has to remember it: in
          PostgreSQL itself.
        </p>
      </Lead>

      <Section title="The policy">
        <p>
          Row-level security lets a table filter its own rows. You turn it on and attach a policy, and
          from then on every query against that table gets the policy&apos;s condition added, whether
          the application asked for it or not.
        </p>
        <Code>{`ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON documents FOR ALL
  USING      (tenant_id = current_setting('app.tenant_id', true))
  WITH CHECK (tenant_id = current_setting('app.tenant_id', true));`}</Code>
        <p>
          <C>USING</C> decides which rows you can see, update or delete. <C>WITH CHECK</C> decides
          which rows you&apos;re allowed to write, so a tenant can&apos;t insert a row stamped with
          someone else&apos;s id either.
        </p>
        <p>
          The <C>true</C> in <C>current_setting(..., true)</C> means &ldquo;return NULL if it&apos;s
          not set&rdquo; instead of raising an error. And <C>tenant_id = NULL</C> is never true. So a
          request that forgot to set a tenant sees nothing at all. It fails closed, which is exactly
          the direction you want a bug to fail in.
        </p>
      </Section>

      <Section title="Setting the tenant, once per transaction">
        <p>
          The application sets <C>app.tenant_id</C> at the start of every transaction, from the
          authenticated request:
        </p>
        <Code>{`@event.listens_for(session, "after_begin")
def _set_tenant(sess, transaction, connection):
    # set_config(..., true) is SET LOCAL, but it accepts bind parameters
    connection.execute(
        text("SELECT set_config('app.tenant_id', :tid, true)"), {"tid": tenant_id}
    )`}</Code>
        <p>
          It has to be <C>SET LOCAL</C> (that&apos;s what the third argument does), not plain{" "}
          <C>SET</C>. A plain <C>SET</C> lasts for the whole connection, and connections are pooled. The
          next request to borrow that connection would inherit the previous tenant&apos;s id. That&apos;s
          a cross-tenant leak created by the very mechanism meant to prevent one. <C>SET LOCAL</C> ends
          with the transaction.
        </p>
      </Section>

      <Section title="The ways it switches itself off">
        <p>This is the part worth reading twice. Row-level security has exits, and they are all quiet.</p>
        <p>
          <strong className="text-slate-100">The table owner skips it.</strong> By default, policies
          don&apos;t apply to the role that owns the table. If your app connects as the same role that
          ran the migrations, you&apos;ve enabled RLS and it does nothing. <C>FORCE ROW LEVEL
          SECURITY</C> makes it apply to the owner too.
        </p>
        <p>
          <strong className="text-slate-100">Superusers skip it, even with FORCE.</strong> So do roles
          with <C>BYPASSRLS</C>. The default user in most Docker Postgres setups is a superuser. The
          application needs its own role that owns nothing and bypasses nothing; migrations run as the
          owner, the app runs as the app role.
        </p>
        <p>
          <strong className="text-slate-100">Views can skip it.</strong> A view normally runs with its
          owner&apos;s rights, so a view created by the owner reads the underlying table as the owner.
          From PostgreSQL 15 you can create it with <C>security_invoker = true</C> so it runs with the
          caller&apos;s rights instead.
        </p>
      </Section>

      <Section title="Not every table can be isolated">
        <p>
          Two tables stayed outside RLS on purpose: tenants and API keys. Authentication has to look up
          the key before any tenant is known, so there&apos;s no tenant to filter by yet. The app role
          gets plain grants on those two and nothing else special.
        </p>
        <p>
          One table needed a split policy. It holds a shared vocabulary: rows with no tenant that every
          tenant reads, plus rows each tenant adds for itself. So <C>USING</C> allows{" "}
          <C>tenant_id IS NULL OR tenant_id = current tenant</C>, while <C>WITH CHECK</C> only allows
          the current tenant. Every tenant can read the shared rows, no tenant can create or edit one,
          and the shared rows are seeded by the migration, running as the owner.
        </p>
        <p>
          And the audit tables got a different kind of protection: the app role has <C>INSERT</C> and{" "}
          <C>SELECT</C> on them and nothing else. The application can add to the history but can&apos;t
          rewrite it, even with a bug.
        </p>
      </Section>

      <Section title="Proving it">
        <p>
          A policy you haven&apos;t tested is a policy you hope works. The tests connect to a real
          Postgres as the app role and check the things that matter: with tenant A&apos;s context set, a
          hand-written query with no <C>WHERE</C> clause at all still returns only A&apos;s rows; with no
          context, it returns nothing; inserting a row for tenant B from tenant A&apos;s context is
          rejected; the shared rows can be read but not written; and <C>UPDATE</C> or <C>DELETE</C> on
          the audit log is refused.
        </p>
        <p>
          The application still scopes its own queries by tenant. Row-level security isn&apos;t a
          replacement for that; it&apos;s what catches the query where someone forgot. That&apos;s the
          whole point: the IDOR bugs I fixed on the ERP would have returned empty results here instead of
          another company&apos;s data.
        </p>
      </Section>
    </ArticleLayout>
  );
}
