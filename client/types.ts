export interface Event {
  id: string;
  name: string;
  date: string;
  description: string;
  type: 'Hackathon' | 'Workshop' | 'Meetup';
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  location: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl?: string;
  socials?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface Announcement {
  id: string;
  date: string;
  title: string;
  content: string;
  priority: 'High' | 'Normal' | 'Low';
}

export interface NavItem {
  id: string;
  label: string;
}