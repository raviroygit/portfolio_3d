import {
  mobile,
  backend,
  creator,
  web,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  figma,
  docker,
  dipole,
  ezycerts,
  hihellohr,
  parking_bucket,
  threejs,
  live,
  portfolio1,
  portfolio2,
  ravi,
  sonali,
  maneesh
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Web Developer",
    icon: web,
  },
  {
    title: "React Native Developer",
    icon: mobile,
  },
  {
    title: "Backend Developer",
    icon: backend,
  },
  {
    title: "Android, iOS",
    icon: creator,
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "figma",
    icon: figma,
  },
  {
    name: "docker",
    icon: docker,
  },
];

const experiences = [
  {
    title: "Full stack Developer",
    company_name: "Dipole tech innovation OPC pvt. ltd.",
    icon: dipole,
    iconBg: "#E6DEDD",
    date: "August 2022 - Present",
    points: [
      "Developing and maintaining web applications using React.js and other related technologies.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
    company_link: "https://dipoletechi.com/"
  },
  {
    title: "Mern Stack Developer",
    company_name: "Ezycerts Solution pvt. ltd.",
    icon: ezycerts,
    iconBg: "#383E56",
    date: "March 2021 - august 2022",
    points: [
      "Developing and maintaining web applications using React.js and other related technologies.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Implementing responsive design and ensuring cross-browser compatibility.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
    company_link: "https://www.ezycerts.com/"
  }

];

const testimonials = [
  {
    testimonial:
      "I thought it was impossible to make a website as beautiful as our product, but Ravi Roy proved me wrong.",
    name: "Maneesh Negi",
    designation: "Sr. Dot net developer",
    company: "Dipole tech innovatio OPC pvt. ltd.",
    image: maneesh,
  },
  {
    testimonial:
      "I've never met a web developer who truly cares about their clients' success like Ravi Roy does.",
    name: "Sonali Suman",
    designation: "Sr. PHP developer",
    company: "Dipole tech innovatio OPC pvt. ltd.",
    image: sonali,
  },
  {
    testimonial:
      "After Ravi Roy optimized our website, our traffic increased by 50%. We can't thank them enough!",
    name: "Ravi Sharma",
    designation: "Software Engineer",
    company: "Kiwi tech",
    image: ravi
  },
];

const projects = [
  {
    name: "Hihellohr",
    description:
      "Best HRMS and Payroll Software: hihellohr is a modern HR performance attendance, leave, staff document management software systems for smart workplace.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "cordova",
        color: "green-text-gradient",
      },
      {
        name: "css",
        color: "pink-text-gradient",
      },
    ],
    image: hihellohr,
    live_icon: live,
    live_link: "https://play.google.com/store/apps/details?id=com.hihellohr.app",
    source_code_link: "https://github.com/raviroygit",
  },
  {
    name: "Parking Bucket",
    description:
      "You are going out of station or going to watch a movie, do not waste your time and fuel in search for parking. Just book parking before you arrive and enjoy your trip.",
    tags: [
      {
        name: "Angular",
        color: "blue-text-gradient",
      },
      {
        name: "cordova",
        color: "green-text-gradient",
      },
      {
        name: "bootstrap",
        color: "pink-text-gradient",
      },
    ],
    image: parking_bucket,
    live_icon: live,
    live_link: "https://play.google.com/store/apps/details?id=com.parkingbucket.dev",
    source_code_link: "https://github.com/raviroygit",
  },
  {
    name: "Portfolio 1",
    description:
      "You are going out of station or going to watch a movie, do not waste your time and fuel in search for parking. Just book parking before you arrive and enjoy your trip.",
    tags: [
      {
        name: "ReactJS",
        color: "blue-text-gradient",
      },
      {
        name: "Styled component",
        color: "green-text-gradient",
      },
      {
        name: "bootstrap",
        color: "pink-text-gradient",
      },
    ],
    image: portfolio1,
    live_icon: live,
    live_link: "https://portfolio.codelength.net/",
    source_code_link: "https://github.com/raviroygit",
  },
  {
    name: "Portfolio 2",
    description:
      "You are going out of station or going to watch a movie, do not waste your time and fuel in search for parking. Just book parking before you arrive and enjoy your trip.",
    tags: [
      {
        name: "ReactJs",
        color: "blue-text-gradient",
      },
      {
        name: "framer-motion",
        color: "green-text-gradient",
      },
      {
        name: "react-bootstrap",
        color: "pink-text-gradient",
      },
    ],
    image: portfolio2,
    live_icon: live,
    live_link: "https://raviroy.codelength.net/",
    source_code_link: "https://github.com/raviroygit",
  },
];

export { services, technologies, experiences, testimonials, projects };
