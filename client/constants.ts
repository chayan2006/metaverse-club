import { Event, TeamMember, Announcement } from './types';

export const CLUB_EVENTS: Event[] = [
  {
    id: '1',
    name: 'Cyber Siege (Developer vs Attacker)',
    date: '26 Feburary, 2026',
    description: 'A CTF competition where developers try to secure their code from attackers.',
    type: 'CTF',
    status: 'Coming soon',
    location: 'Yet to announce'
  },
  {
    id: '2',
    name: '<Code-A-Thone>',
    date: '26 Sep 2025',
    description: 'Learn the basics of 3D web graphics. No prior experience required.',
    type: '24 hours Hackathon',
    status: 'Completed',
    location: 'venue 14 501 at 6pm'
  },
  {
    id: '3',
    name: 'Web3 Security Summit',
    date: 'Oct 10, 2024',
    description: 'Panel discussion with industry experts on smart contract security.',
    type: 'Meetup',
    status: 'Completed',
    location: 'Metaverse Plaza'
  },
  {
    id: '4',
    name: 'AI in Gaming',
    date: 'Nov 05, 2024',
    description: 'Exploring how generative AI is reshaping NPC behavior and world generation.',
    type: 'Workshop',
    status: 'Completed',
    location: 'Virtual Hall B'
  },

];

export const TEAM_MEMBERS: TeamMember[] = [
  { id: '1', name: 'Ashish Rai', role: 'CEO(Chief Executive Officer' },
  { id: '2', name: 'Abhay Majumdar', role: 'Co-CEO(Chief Executive Officer' },
  { id: '3', name: 'Akshat Singh', role: 'COO(Chief Operating Officer)' },
  { id: '4', name: 'Charu Verma', role: 'Social Media Head' },
  { id: '5', name: 'Divyanshi Sharma', role: 'HR(Human Resource)' },
  { id: '6', name: 'Chayan Khatua', role: 'Developer' },
  { id: '7', name: 'Sumit Kumar', role: 'Social Media Head' },
  { id: '8', name: 'Priyanchal Tripathi', role: 'Social Media Co-Head & Content Head' },
  { id: '9', name: 'Dheeraj', role: 'Event Management Co-Head' },
  { id: '10', name: 'Aryan', role: 'Event Management Head' },
  { id: '11', name: 'Aditya', role: 'CDO(Chief Digital Officer)' },
];

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    date: '2024-10-01',
    title: 'New Partnership with Polygon',
    content: 'We are thrilled to announce a strategic partnership with Polygon for our upcoming hackathon!',
    priority: 'High'
  },
  {
    id: '2',
    date: '2024-09-28',
    title: 'Recruitment Drive Open',
    content: 'Looking for core members to join the Web3 dev team. Apply before Oct 15th.',
    priority: 'Normal'
  },
  {
    id: '3',
    date: '2024-09-20',
    title: 'Server Maintenance',
    content: 'Discord server will be undergoing maintenance on Sunday night.',
    priority: 'Low'
  }
];