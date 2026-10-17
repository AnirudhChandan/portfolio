// Freelance landing pages (/for-business/<slug>). Facts mirror ~/assisstant/portfolio-in/FACTS.md:
// Max Estates is named; the gate-pass institution and the ERP/healthcare employers are not. No prices.
export type Bi = { en: string; hi: string };

export type Industry = {
  slug: string;
  short: string;
  seoTitle: string;
  seoDescription: string;
  title: Bi;
  problem: Bi;
  offers: Bi[];
  proof: Bi[];
  image?: { src: string; width: number; height: number; alt: string };
};

export const industries: Industry[] = [
  {
    slug: "societies-schools",
    short: "Housing societies & schools",
    seoTitle: "CCTV alert dashboards & QR gate passes in Dehradun",
    seoDescription:
      "Software for housing societies, schools and institutions: one guard screen for AI camera alerts, patrol reports, and QR visitor passes that open the gate. Live in Dehradun since Sep 2026.",
    title: {
      en: "CCTV alerts and gate passes for housing societies, schools and institutions",
      hi: "हाउसिंग सोसाइटी, स्कूल और संस्थानों के लिए CCTV अलर्ट और गेट पास",
    },
    problem: {
      en: "You've already paid for cameras, an AI box, QR readers and a boom barrier. The detections go nowhere useful, visits are approved by phone or email, and nobody can tell you whether the guard actually walked the patrol route.",
      hi: "कैमरे, AI बॉक्स, QR रीडर और बूम बैरियर पर पैसा लग चुका है। फिर भी अलर्ट किसी काम के नहीं, विज़िट की मंज़ूरी फ़ोन या ईमेल पर होती है, और कोई नहीं बता सकता कि गार्ड ने पेट्रोल रूट सच में घूमा या नहीं।",
    },
    offers: [
      {
        en: "One guard screen for every camera alert: one tap to check, reasons in plain words, voice alerts in Hindi and English.",
        hi: "हर कैमरा अलर्ट एक गार्ड स्क्रीन पर: एक टैप में जाँच, सीधी भाषा में कारण, हिंदी और अंग्रेज़ी में आवाज़ से अलर्ट।",
      },
      {
        en: "The patrol report management actually wants: which checkpoint was missed and when, day and night, in Excel or PDF.",
        hi: "मैनेजमेंट को जो रिपोर्ट चाहिए: कौन सा चेकपॉइंट कब छूटा, दिन और रात, Excel या PDF में।",
      },
      {
        en: "A visitor-pass app: parents or vendors request a visit, staff approve in the same app, a QR on the phone opens the gate, every entry is logged.",
        hi: "विज़िटर पास ऐप: माता-पिता या वेंडर विज़िट माँगें, स्टाफ़ उसी ऐप में मंज़ूर करे, फ़ोन पर QR से गेट खुले, और हर एंट्री दर्ज हो।",
      },
      {
        en: "Works with what you already own: your cameras, gate readers and SMS gateway. Your data stays on your premises.",
        hi: "जो सामान पहले से है उसी के साथ: आपके कैमरे, गेट रीडर और SMS गेटवे। आपका डेटा आपके परिसर में ही रहता है।",
      },
    ],
    proof: [
      {
        en: "Max Estates, Dehradun: 8 cameras, 7 alert types, installed by me on the guard-room PC and live since September 2026.",
        hi: "मैक्स एस्टेट्स, देहरादून: 8 कैमरे, 7 तरह के अलर्ट, गार्ड रूम के PC पर मैंने खुद लगाया, सितंबर 2026 से चालू।",
      },
      {
        en: "A visitor-pass app for a residential institution in Dehradun: in build since October 2026.",
        hi: "देहरादून के एक आवासीय संस्थान के लिए विज़िटर पास ऐप: अक्टूबर 2026 से बन रहा है।",
      },
    ],
    image: {
      src: "/work/max-estates-guard.jpg",
      width: 1600,
      height: 1111,
      alt: "Guard screen with camera alerts and one-tap check buttons (demo data)",
    },
  },
  {
    slug: "clinics",
    short: "Clinics",
    seoTitle: "Clinic software: patient queue, records & prescriptions",
    seoDescription:
      "Software for clinics: a patient queue with QR self check-in, records and prescriptions that print as they look, and offline-safe sync. Built by an engineer on a platform used by 2,300+ clinics.",
    title: {
      en: "Software for clinics: queues, records and prescriptions that just work",
      hi: "क्लिनिक के लिए सॉफ़्टवेयर: कतार, रिकॉर्ड और पर्चे, बिना झंझट",
    },
    problem: {
      en: "Patients wait without knowing their turn, records are split between registers and several apps, and every prescription gets written twice.",
      hi: "मरीज़ों को अपनी बारी का पता नहीं, रिकॉर्ड रजिस्टर और कई ऐप में बिखरे हैं, और हर पर्चा दो बार लिखना पड़ता है।",
    },
    offers: [
      {
        en: "A patient queue on the waiting-room TV, with QR self check-in.",
        hi: "वेटिंग रूम के TV पर मरीज़ों की कतार, और QR स्कैन करके खुद चेक-इन।",
      },
      {
        en: "Patient records, prescriptions and reports that print exactly as they look on screen.",
        hi: "मरीज़ों के रिकॉर्ड, पर्चे और रिपोर्ट: जैसे स्क्रीन पर, वैसे ही प्रिंट।",
      },
      {
        en: "Keeps working when the internet drops; changes made offline sync correctly when it returns.",
        hi: "इंटरनेट जाए तो भी काम चले; ऑफ़लाइन किए बदलाव नेट आते ही सही-सही सिंक हों।",
      },
      {
        en: "Experience with ABHA patient identity and consent flows for India's national health stack.",
        hi: "भारत के नेशनल हेल्थ स्टैक के लिए ABHA पेशेंट ID और कंसेंट फ़्लो का अनुभव।",
      },
    ],
    proof: [
      {
        en: "I build for a healthcare records platform used by 2,300+ clinics.",
        hi: "मैं 2,300+ क्लिनिक में इस्तेमाल होने वाले हेल्थकेयर रिकॉर्ड प्लेटफ़ॉर्म पर काम करता हूँ।",
      },
      {
        en: "Built a clinic practice-management system: one app for several specialties, per-clinic patient numbering, e-prescriptions and a QR check-in queue.",
        hi: "एक क्लिनिक मैनेजमेंट सिस्टम बनाया: कई स्पेशलिटी के लिए एक ऐप, हर क्लिनिक की अपनी पेशेंट नंबरिंग, ई-पर्चे और QR चेक-इन वाली कतार।",
      },
    ],
  },
  {
    slug: "builders",
    short: "Builders & contractors",
    seoTitle: "Software for builders: site timesheets, project costs & lead websites",
    seoDescription:
      "Software for builders and contractors: a phone app for site timesheets, fast project and cost screens, and websites with cost estimators that qualify leads.",
    title: {
      en: "Software for builders and contractors: costs, timesheets and leads in one place",
      hi: "बिल्डर और कॉन्ट्रैक्टर के लिए सॉफ़्टवेयर: लागत, टाइमशीट और लीड एक जगह",
    },
    problem: {
      en: "Site teams fill in paper timesheets that the office types up again, project costs are known a month late, and website enquiries arrive as 'hi, how much?'.",
      hi: "साइट की टीम कागज़ पर टाइमशीट भरती है जिसे ऑफ़िस दोबारा टाइप करता है, प्रोजेक्ट की लागत महीने भर बाद पता चलती है, और वेबसाइट से बस 'कितना लगेगा?' वाले मैसेज आते हैं।",
    },
    offers: [
      {
        en: "A phone app that turns a paper timesheet into a 30-second action and updates project cost straight away.",
        hi: "फ़ोन ऐप जिससे कागज़ की टाइमशीट 30 सेकंड का काम बन जाए और प्रोजेक्ट की लागत तुरंत अपडेट हो।",
      },
      {
        en: "Fast project, material and cost screens. I've taken an ERP's slowest pages from 30 seconds to 2.5.",
        hi: "प्रोजेक्ट, मटेरियल और लागत की तेज़ स्क्रीन। मैंने एक ERP के सबसे धीमे पेज 30 सेकंड से 2.5 सेकंड पर लाए हैं।",
      },
      {
        en: "A website with a cost estimator, so enquiries arrive with a brief attached.",
        hi: "कॉस्ट एस्टिमेटर वाली वेबसाइट, ताकि हर पूछताछ पूरी जानकारी के साथ आए।",
      },
      {
        en: "Each company and site sees only its own data, with the access checks tested.",
        hi: "हर कंपनी और साइट को सिर्फ़ अपना डेटा दिखे, और ये जाँच टेस्ट की हुई हो।",
      },
    ],
    proof: [
      {
        en: "Construction project-management ERP used by ~20 companies: 711 of its 1,100 commits are mine, and it went from 0 to 1,435 automated tests.",
        hi: "करीब 20 कंपनियों का कंस्ट्रक्शन प्रोजेक्ट-मैनेजमेंट ERP: इसके 1,100 में से 711 कमिट मेरे हैं, और 0 से 1,435 ऑटोमेटेड टेस्ट तक पहुँचा।",
      },
      {
        en: "Builder websites with project pricers: KSP Group (Melbourne, in build) and Gharwale.",
        hi: "प्रोजेक्ट प्राइसर वाली बिल्डर वेबसाइटें: KSP Group (मेलबर्न, बन रही है) और घरवाले।",
      },
    ],
  },
];
