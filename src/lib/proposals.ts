import { posts } from "./posts";

// Sample proposals: how Anirudh would plan a large system. Every client, number and estimate here
// is invented, and every page says so. Nothing here may read as a past project; real work is only
// what `basis` links to. No prices (site rule). Regulations checked against primary sources, Nov 2026.
type Link = { label: string; href: string };

export type Proposal = {
  slug: string; // /proposals/<slug>
  title: string;
  field: string;
  short: string;
  scenario: string;
  minute: string[]; // the plain version for a decision-maker
  targets: { n: string; l: string }[];
  layers: { name: string; parts: string }[];
  decisions: { choice: string; why: string; cost: string; proof?: Link }[];
  numbers: { takeaway: string; rows: { label: string; working: string; result: string }[] };
  failures: { what: string; then: string }[];
  rules: string[];
  stages: { name: string; time: string; done: string }[];
  team: string;
  stack: string;
  basis: Link[];
};

const post = (slug: string): Link => {
  const p = posts.find((x) => x.slug === slug);
  if (!p) throw new Error(`No post: ${slug}`);
  return { label: p.title, href: `/blog/${slug}` };
};

const CERT_IN = "CERT-In directions: report listed incidents within 6 hours and keep system logs for 180 days in India.";

export const proposals: Proposal[] = [
  {
    slug: "hospital-network",
    title: "Hospital network records platform",
    field: "Healthcare",
    short: "One patient record across 40 hospitals and 300 clinics, which keeps working when a site loses its internet.",
    scenario:
      "A hospital group with 40 hospitals and 300 clinics in three states. Each site runs a different system, and a patient's history does not follow them between sites.",
    minute: [
      "Every site gets the same system, and a patient's record follows them between sites with their consent.",
      "A hospital keeps working when its internet drops, and catches up when it returns.",
      "Every read and change to a record is logged, so you can always answer who saw what.",
      "We roll out one site at a time. The old system stays available until that site signs off.",
    ],
    targets: [
      { n: "Under 300 ms", l: "for 95% of screens" },
      { n: "8 hours", l: "a site can run with no internet" },
      { n: "0", l: "committed records lost if a server fails" },
    ],
    layers: [
      { name: "People", parts: "Ward and front-desk web app · tablet app for rounds · queue screens · patient access through ABHA" },
      { name: "At each site", parts: "Small local server · copy of active patients · runs offline and syncs when the link returns" },
      { name: "Front door", parts: "Single sign-on · role-based access · a log entry for every record read" },
      { name: "Core application", parts: "Patients · visits · orders · pharmacy · billing · consent, in one deployable with strict module boundaries" },
      { name: "Data", parts: "PostgreSQL with row-level security · standby in a second zone · read replicas · object storage · Kafka for events" },
      { name: "Outside systems", parts: "ABDM (ABHA, consent, FHIR records) · lab machines over HL7 v2 · imaging over DICOM · SAP or Tally for finance" },
    ],
    decisions: [
      {
        choice: "One modular application, not microservices",
        why: "A team of this size cannot safely run thirty services. Boundaries between modules are enforced at build time, so a module can be split out later if the numbers ever demand it.",
        cost: "One release touches every module, so releases need staged rollout and feature flags.",
      },
      {
        choice: "Row-level security to keep hospitals apart",
        why: "The database enforces the boundary itself, so a query that forgets to filter returns nothing instead of another hospital's patients.",
        cost: "Every transaction must set its tenant, and connection pooling needs care.",
        proof: post("row-level-security"),
      },
      {
        choice: "Versioned writes for offline sync, not last-write-wins",
        why: "Clinical data must never be silently overwritten. A change based on an old version is held, and a person resolves the conflict.",
        cost: "Extra hardware at each site, and a conflict screen that staff must be trained on.",
        proof: post("lost-update"),
      },
      {
        choice: "A transactional outbox for events",
        why: "A record change and its event commit together, so labs and billing never miss an update, and consumers ignore duplicates.",
        cost: "Events arrive a moment later, and the outbox table needs regular cleaning.",
        proof: post("exactly-once-kafka"),
      },
      {
        choice: "FHIR at the edge, our own model inside",
        why: "ABDM requires FHIR R4 bundles for exchange, but daily screens need a schema shaped for their own queries.",
        cost: "A mapping layer to maintain and test against the NRCeS profiles.",
      },
    ],
    numbers: {
      takeaway:
        "This fits one well-sized PostgreSQL primary with read replicas. Sharding on day one would add risk and solve nothing. Imaging stays in the existing PACS.",
      rows: [
        { label: "Writes at peak", working: "60,000 visits a day × 40 writes, 70% in 8 busy hours, × 3 for the peak", result: "about 175 a second" },
        { label: "Reads at peak", working: "10 reads for every write", result: "about 1,750 a second" },
        { label: "Record data", working: "60,000 visits × 40 writes × 2 KB × 365 days", result: "about 1.75 TB a year" },
        { label: "Documents", working: "60,000 visits × one 500 KB document × 365 days", result: "about 11 TB a year" },
      ],
    },
    failures: [
      { what: "A site loses its internet", then: "The local server keeps the site running. Changes queue and sync when the link returns, and conflicts go to a person." },
      { what: "The main database server fails", then: "A standby in a second zone takes over within a minute, with no committed data lost." },
      { what: "A release has a bug", then: "It reaches one pilot site first. Database changes stay backward-compatible, so rolling back never needs a restore." },
      { what: "Someone opens a record they shouldn't", then: "Every read is logged. Emergency access needs a reason, and a weekly report shows unusual access." },
      { what: "A site server is stolen", then: "Disks are encrypted, credentials are short-lived, and the server can be revoked remotely." },
    ],
    rules: [
      "DPDP Act 2023 and Rules 2025 (full duties from May 2027): consent, security safeguards, at least a year of access logs, and breach notice to affected people and the Data Protection Board, with details within 72 hours.",
      "ABDM: M1 (ABHA), M2 (sharing records as a Health Information Provider) and M3 (viewing records with consent), exchanging FHIR R4 bundles to NRCeS profiles.",
      CERT_IN,
    ],
    stages: [
      { name: "Discovery", time: "3 weeks", done: "Site visits, a data audit and a load test of the riskiest path. You get a fixed plan and can stop here and keep everything." },
      { name: "One clinic", time: "10 to 12 weeks", done: "Registration, queue, notes and prescriptions live at one clinic, with ABHA." },
      { name: "First hospital", time: "4 months", done: "Orders, lab, pharmacy, billing and the offline server, running beside the old system until sign-off." },
      { name: "Network rollout", time: "12 to 18 months", done: "Three to five sites a month, each with data migration and staff training in their own language." },
    ],
    team: "Technical lead (me), 4 backend engineers, 2 frontend, 1 mobile, 1 DevOps, 2 QA and 1 clinical analyst.",
    stack: "TypeScript or Java, PostgreSQL, Kafka, Redis, Keycloak and OpenTelemetry, on AWS Mumbai and Hyderabad.",
    basis: [
      { label: "My work on a healthcare records platform used by 2,300+ clinics", href: "/#experience" },
      post("row-level-security"),
      post("lost-update"),
      post("killing-polling"),
    ],
  },
  {
    slug: "erp-modernisation",
    title: "Group-wide ERP modernisation",
    field: "Manufacturing and construction",
    short: "Replacing a 15-year-old ERP used by 12 companies, one module at a time, with no big-bang cutover.",
    scenario:
      "A construction and manufacturing group with 12 companies, 180 sites and 6,000 users on a 15-year-old Java ERP. SAP handles group finance, and smaller units use Tally.",
    minute: [
      "We do not rewrite everything and switch over on one weekend. That is how ERP projects fail.",
      "New modules replace old ones one at a time, while the business keeps running on both.",
      "Slow pages and security gaps get fixed in the first three months, before any new module ships.",
      "SAP and Tally stay in place. We connect to them properly and never write into their tables.",
    ],
    targets: [
      { n: "Under 1 s", l: "for 95% of list pages, from any site" },
      { n: "Minutes", l: "to route a module back to the old system" },
      { n: "0", l: "weekend-long cutovers" },
    ],
    layers: [
      { name: "People", parts: "Web app · field app that works offline on site" },
      { name: "Router", parts: "Sends each screen to the old or new module, with one switch per module and company" },
      { name: "New modules", parts: "Procurement · projects · timesheets · inventory · approvals, in one codebase with strict boundaries" },
      { name: "Old ERP", parts: "Keeps running, wrapped in tests, and shrinks module by module" },
      { name: "Data", parts: "PostgreSQL for new modules · change data capture from the old database · Kafka · read replicas for reports" },
      { name: "Outside systems", parts: "SAP through released APIs and events · Tally through its XML interface · GST e-invoice and e-way bill portals" },
    ],
    decisions: [
      {
        choice: "Replace piece by piece, not a rewrite",
        why: "This is the strangler pattern. The business never stops, each module proves itself with real users, and you can stop at any point with a working system.",
        cost: "Old and new run side by side for many months, with a routing layer and data sync to maintain.",
      },
      {
        choice: "Measure every screen before changing any",
        why: "On a real ERP I audited 53 list screens and found 39 making one database call per row. Fixing the worst first gave the biggest gains.",
        cost: "Two weeks before anything visibly improves.",
        proof: post("n-plus-one"),
      },
      {
        choice: "Change data capture, not writing to both databases",
        why: "When an app writes to two databases, a failure between the writes leaves them disagreeing for good. Reading the old database's change log keeps one source of truth.",
        cost: "Kafka Connect becomes another system to run, and schema changes need coordinating.",
      },
      {
        choice: "Tests around the old system first",
        why: "Nobody can change untested code safely. Tests that record today's behaviour catch anything a change breaks.",
        cost: "The first weeks produce tests, not features.",
        proof: { label: "Construction ERP case study: 0 to 1,435 tests", href: "/work/construction-erp" },
      },
      {
        choice: "SAP stays in charge of group finance",
        why: "Using SAP's released APIs keeps your SAP upgrades safe.",
        cost: "Slower than reading its tables directly, and a mapping layer to keep current.",
      },
    ],
    numbers: {
      takeaway: "The network is often the real bottleneck. Cutting the number of queries helps more than buying a bigger server.",
      rows: [
        { label: "One page, far from its database", working: "175 queries × 60 ms round trip (the query count is from a real page I fixed)", result: "10.5 seconds of waiting" },
        { label: "The same page, fixed", working: "12 queries × 60 ms", result: "under 1 second" },
        { label: "Peak traffic", working: "6,000 users, 30% active, one action every 20 seconds", result: "90 requests a second" },
        { label: "First data copy", working: "2 TB at 50 MB a second", result: "about 11 hours, then live sync" },
        { label: "Month-end e-invoices", working: "100,000 invoices over 3 days of 8 hours", result: "about 1.2 a second, easy for a queue" },
      ],
    },
    failures: [
      { what: "A new module misbehaves", then: "Flip its route back. Both systems stay in sync until that module is signed off, so this takes minutes." },
      { what: "Data sync falls behind", then: "An alarm fires at 30 seconds of lag. Screens that need fresh data read from the old system until it catches up." },
      { what: "The GST portal is down", then: "Invoices wait in a queue and retry safely. The portal rejects a duplicate of the same invoice, and an alert fires well before the 30-day limit." },
      { what: "Month-end reports slow everything", then: "Reports run on read replicas, so they can't slow down data entry." },
      { what: "Someone edits a posted entry", then: "The edit log records who changed what and when, and it can't be turned off." },
    ],
    rules: [
      "Companies (Accounts) Rules: since 1 April 2023, accounting software must keep an audit trail and edit log of every change, which cannot be disabled.",
      "GST: e-invoicing applies from ₹5 crore of turnover, with a 30-day reporting limit from ₹10 crore, plus e-way bills.",
      "DPDP Act and Rules for employee and vendor data.",
      "Separation of duties: the person who raises a purchase can't approve it, and roles are reviewed every quarter.",
    ],
    stages: [
      { name: "Audit", time: "4 weeks", done: "Every screen measured, every module mapped, security gaps listed. You get a ranked plan and can stop here and keep it." },
      { name: "Safety net", time: "8 weeks", done: "Tests, a deploy pipeline and monitoring around the old system, plus fixes for the worst pages and security gaps." },
      { name: "First module", time: "3 months", done: "One module, such as timesheets, live for one company, with the router and data sync proven." },
      { name: "Remaining modules", time: "18 to 24 months", done: "One module a quarter, one company at a time, until the old system can be switched off." },
    ],
    team: "Technical lead (me), 5 backend engineers, 2 frontend, 1 mobile, 1 DevOps, 2 QA and 1 business analyst from your finance team.",
    stack: "Java and Spring Boot, React, React Native, PostgreSQL, Kafka with Debezium, and OpenTelemetry.",
    basis: [
      { label: "Construction ERP modernisation, used by about 20 companies", href: "/work/construction-erp" },
      post("n-plus-one"),
    ],
  },
  {
    slug: "security-operations",
    title: "Multi-site security operations platform",
    field: "Security and facilities",
    short: "One control room for 3,000 cameras across 60 sites, built around what an operator can actually handle.",
    scenario: "A real-estate and campus group with 60 sites, 3,000 cameras from mixed vendors and one central control room.",
    minute: [
      "You keep the cameras you already own. Video stays on site, and only alerts travel to the control room.",
      "Operators see a short list of real incidents instead of a wall of detections.",
      "The system also notices what did not happen: a missed patrol, an empty post, a silent camera.",
      "AI suggests and a person decides, and every decision is recorded.",
    ],
    targets: [
      { n: "Under 5 s", l: "from detection to the operator's screen" },
      { n: "72 hours", l: "a site keeps events during an outage" },
      { n: "Under 2 min", l: "before an unanswered alert escalates" },
    ],
    layers: [
      { name: "Cameras", parts: "Existing cameras over ONVIF and RTSP · access control and gate readers" },
      { name: "At each site", parts: "Recorder with 30 days of video · AI box for detection · small server that buffers events" },
      { name: "Event pipeline", parts: "Kafka · duplicate removal · grouping events into incidents · patrol and absence timers" },
      { name: "Control room", parts: "Incident queue · clips on demand · escalation · wall view · Hindi and English" },
      { name: "Data", parts: "PostgreSQL for incidents · object storage for snapshots · reports for management" },
      { name: "Security", parts: "Single sign-on · every clip view logged · exported clips watermarked" },
    ],
    decisions: [
      {
        choice: "Video stays on site; only events travel",
        why: "Sending 3,000 streams to the cloud needs about 6 Gbps of constant upload. Events need a tiny fraction of that.",
        cost: "Hardware at each site to manage remotely, and clips load on demand.",
      },
      {
        choice: "Design around operator attention",
        why: "Ten operators a shift can handle about 28,800 alerts a day. The cameras produce far more, so grouping events into incidents is the core of the product.",
        cost: "Grouping can hide a real event, so each rule is tested against recorded footage.",
      },
      {
        choice: "Treat silence as an event",
        why: "A missed patrol or a dead camera produces no detection at all. Timers that expect something to happen catch what detection alone cannot.",
        cost: "Timers need tuning per site to avoid false alarms.",
        proof: post("absence-timers"),
      },
      {
        choice: "Work with any camera vendor",
        why: "Replacing 3,000 working cameras is a waste, and ONVIF and RTSP cover most of them.",
        cost: "Vendor quirks mean a test matrix, and some old models may need replacing.",
      },
      {
        choice: "Retries that back off",
        why: "When a site's link returns, thousands of buffered events arrive at once. Backoff with jitter and per-site limits stop one recovery from overloading the centre.",
        cost: "A site's oldest events can take a few minutes to arrive after an outage.",
        proof: post("retry-storms"),
      },
    ],
    numbers: {
      takeaway:
        "The bottleneck here is human attention, not servers. The system has to cut 2.16 million events a day down to the 28,800 alerts people can handle, about 75 to 1.",
      rows: [
        { label: "Video, if sent to the cloud", working: "3,000 cameras × 2 Mbps", result: "6 Gbps, all day" },
        { label: "Video storage at one site", working: "50 cameras × 2 Mbps × 30 days", result: "about 32 TB" },
        { label: "Events", working: "3,000 cameras × 30 events an hour × 24 hours", result: "2.16 million a day" },
        { label: "Snapshots", working: "2.16 million × 200 KB × 90 days", result: "about 39 TB" },
        { label: "What people can handle", working: "10 operators × 120 alerts an hour × 24 hours", result: "28,800 alerts a day" },
      ],
    },
    failures: [
      { what: "A site loses its link", then: "The site keeps recording and raises local alarms. Events wait in the buffer for up to 72 hours and then catch up." },
      { what: "A camera dies or is covered", then: "A missing heartbeat or a blocked view becomes an alert of its own." },
      { what: "Rain sets off every camera", then: "Events group into one incident per area, and a banner tells operators why the count is high." },
      { what: "Nobody answers an alert", then: "It escalates to a supervisor after 2 minutes, then to a phone call." },
      { what: "The control room system goes down", then: "Each site keeps working on its own, and a standby in a second zone takes over." },
    ],
    rules: [
      "DPDP Act and Rules: video of people is personal data, so sites need notices, a fixed retention period and a log of who viewed or exported a clip.",
      "India's Essential Requirements for CCTV security have applied to certified camera models since 9 April 2025. New purchases must meet them, and existing cameras get a risk review.",
      CERT_IN,
    ],
    stages: [
      { name: "Site survey", time: "3 weeks", done: "Two sites audited, cameras tested for compatibility and networks measured. You can stop here and keep the report." },
      { name: "Two-site pilot", time: "10 weeks", done: "Detection, incidents and patrol timers live at two sites, tuned against real footage." },
      { name: "Control room", time: "3 months", done: "Central incident queue, escalation and reports, with ten sites connected." },
      { name: "All sites", time: "9 to 12 months", done: "Five to six sites a month, with training on site." },
    ],
    team: "Technical lead (me), 3 backend engineers, 1 frontend, 1 computer-vision engineer, 1 DevOps, 1 QA and 2 field engineers.",
    stack: "Node.js or Python, Kafka, PostgreSQL, ONVIF, RTSP and OpenTelemetry.",
    basis: [
      { label: "The dashboard I run at Max Estates, Dehradun: 8 cameras, live since September 2026. This plan scales that design up.", href: "/work/max-estates" },
      post("absence-timers"),
      post("retry-storms"),
    ],
  },
  {
    slug: "document-ai",
    title: "Enterprise document AI platform",
    field: "Logistics and insurance",
    short: "Reading 2 million documents a month with AI, while rules and people decide the outcome.",
    scenario: "A logistics or insurance group receiving 2 million documents a month through email, scans and partner portals, all checked by hand today.",
    minute: [
      "AI reads the documents. Rules check them. A person confirms anything doubtful.",
      "It starts in shadow mode, working beside your team without making decisions, until the numbers earn trust.",
      "Every decision records what was read, which rule applied and who confirmed it.",
      "Documents stay in your own cloud account in India and never train anyone's model.",
    ],
    targets: [
      { n: "Over 90%", l: "of documents with no human touch" },
      { n: "Under 1 min", l: "to process a document" },
      { n: "100%", l: "of decisions traceable" },
    ],
    layers: [
      { name: "Intake", parts: "Email · scanner folders · partner APIs · duplicate check by content hash" },
      { name: "Reading", parts: "OCR · document classifier · AI field extraction with a fixed output schema" },
      { name: "Checking", parts: "Rules the customer can edit · checks across related documents · hold until a missing document arrives" },
      { name: "People", parts: "Review screen for doubtful cases · maker-checker approval · every override recorded with a reason" },
      { name: "Data", parts: "PostgreSQL with row-level security · immutable versions · object storage · queue with autoscaling workers" },
      { name: "Measurement", parts: "Labelled test set · accuracy per field · weekly audit sample · alert when overrides rise" },
    ],
    decisions: [
      {
        choice: "AI reads; it never decides",
        why: "A model that is right 98% of the time is still wrong 40,000 times a month at this volume. Rules and people make the decision, so errors are caught and explained.",
        cost: "Some documents a model could have handled still go to a person.",
      },
      {
        choice: "Trust measured accuracy, not the model's own confidence",
        why: "Models are often confident and wrong. Each field gets a threshold from a labelled test set, based on what an error in that field costs.",
        cost: "Someone has to label a few thousand documents at the start.",
      },
      {
        choice: "Rules live in settings, not code",
        why: "On a real platform, this let a whole second business area go live with no engine changes.",
        cost: "Rules need their own testing: each one runs against last month's documents before it goes live.",
        proof: { label: "Document workflow platform case study", href: "/work/document-workflow" },
      },
      {
        choice: "Treat every document as hostile",
        why: "Text inside a document can try to instruct the model. So the model has no tools, must return a fixed schema, and has its output checked by rules.",
        cost: "Less flexible than letting a model act, which is the point.",
      },
      {
        choice: "Models can change, but only through a test",
        why: "Models improve often. A new one must beat the current one on the labelled set before it touches production.",
        cost: "A test set and an evaluation pipeline to keep up to date.",
      },
    ],
    numbers: {
      takeaway: "Accuracy is a staffing number. Each 1% more documents handled with no human touch saves about 4 reviewers.",
      rows: [
        { label: "Average load", working: "2 million documents ÷ 22 working days ÷ 8 hours", result: "about 3 documents a second" },
        { label: "Peak load", working: "4 × the average, at 3 pages a document", result: "about 38 pages a second" },
        { label: "OCR workers", working: "38 pages a second × 2 seconds a page", result: "about 76 at peak, fewer overnight" },
        { label: "Reviewers, if 8% need a person", working: "160,000 documents × 2 minutes ÷ 22 days ÷ 8 hours", result: "about 30 people" },
        { label: "Each 1% of automation", working: "20,000 documents × 2 minutes ÷ 22 days ÷ 8 hours", result: "about 4 people" },
        { label: "Storage", working: "2 million × 3 pages × 300 KB × 12 months", result: "about 22 TB a year" },
      ],
    },
    failures: [
      { what: "The AI provider goes down", then: "Documents wait in the queue and nothing is lost. OCR and rules keep running, and work resumes when the model returns." },
      { what: "Model quality slowly drops", then: "Weekly audit samples and the override rate catch it, and an alert fires early." },
      { what: "The same document arrives twice", then: "A content hash spots it, and the first result is reused." },
      { what: "A related document is missing", then: "The case goes on hold and rechecks itself when the document arrives." },
      { what: "A bad rule goes live", then: "Rules are versioned and can be rolled back. Every decision records its rule version, so affected cases can be found and rerun." },
    ],
    rules: [
      "DPDP Act and Rules: a clear purpose for each document type, retention limits, at least a year of access logs, and breach notice within the required times.",
      "Data stays in your own cloud account in India, with contracts that stop providers training on it.",
      "Sector rules, such as IRDAI's for insurers, get mapped during the baseline stage.",
      CERT_IN,
    ],
    stages: [
      { name: "Baseline", time: "4 weeks", done: "A sample of real documents labelled, today's accuracy and cost measured, and a go or no-go decision." },
      { name: "Shadow mode", time: "10 weeks", done: "One document family runs beside your team with no decisions, and accuracy is compared every week." },
      { name: "Straight-through", time: "8 weeks", done: "The safest cases go through with no human touch, and everything else goes to review." },
      { name: "More families", time: "One a month", done: "New document types added through settings until the target is met." },
    ],
    team: "Technical lead (me), 3 backend engineers, 1 ML engineer, 1 frontend, 1 DevOps, 1 QA and reviewers from your team to label documents.",
    stack: "Python, FastAPI, PostgreSQL, Celery, object storage and OpenTelemetry, with OCR and models in your own cloud account.",
    basis: [
      { label: "Document workflow platform: 13 document types and 412 automated tests, built for a shipping-software company", href: "/work/document-workflow" },
      post("row-level-security"),
      post("exactly-once-kafka"),
    ],
  },
];
