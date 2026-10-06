// ===== Packisher news =====
// To post an update, copy one block below, paste it at the TOP of the list,
// and change the words. Newest first. Save, commit and push.
//
//   type:   "launch", "rosc", "community", "studio" or "research"  (sets the icon and colour)
//   date:   "2026-09-30"   (year-month-day)
//   title:  a short headline
//   text:   one or two sentences
//   link:   optional: "#rosc", "#contact", "#services" or a full https:// address
//   linkText: optional label for the link
//   image:  optional picture in assets/, shown in the full News window
//   imageAlt: describes the picture
//   by:     optional, defaults to "Sherine A."

window.PACKISHER_NEWS = [
  {
    type: "rosc",
    date: "2026-10-06",
    title: "The new ROSC website is live",
    text: "rosc.packisher.com has guides with screenshots, answers to common questions and a place to follow every release.",
    image: "news-launch.jpg",
    imageAlt: "The ROSC home page, showing the app on a phone",
    link: "https://rosc.packisher.com",
    linkText: "Visit rosc.packisher.com",
  },
  {
    type: "launch",
    date: "2026-09-30",
    title: "The new packisher.com is live",
    text: "Our studio site launched today. Every icon on this desktop opens a window, so click around and say hello.",
  },
  {
    type: "rosc",
    date: "2026-09-28",
    title: "ROSC 1.1.0 is rolling out",
    text: "Invite links, a group noticeboard, Trust Score history and owing groups are on their way to testers on iOS and Android.",
    link: "#rosc",
    linkText: "Take a look",
  },
  {
    type: "community",
    date: "2026-09-27",
    title: "Join the ROSC testing group",
    text: "ROSC is in closed testing. If your savings group wants early access, request a tester invite.",
    link: "#contact",
    linkText: "Request access",
  },
];
