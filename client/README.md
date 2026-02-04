




1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
1. The Core Data & Logic (The "Brain")
These are the most important files for managing content without touching complex code.
_________(constants.ts)_______ (CRITICAL FILE)
What it contains: All the hardcoded data for your website.
Edit this to:
Add/Remove/Edit Events (CLUB_EVENTS).
Add/Remove Team Members (TEAM_MEMBERS).
Add/Remove News Updates (ANNOUNCEMENTS).
Note: This is your "database" for now.
_______(types.ts)_________
What it contains: TypeScript definitions (interfaces) that define what data looks like.
Edit this to: Change the structure of data. For example, if you want to add an instagramUrl to your Team Members, you must add it here first, then add the actual link in constants.ts.
2. The Main Structure (The "Skeleton")
_________(index.html)_________
What it contains: The raw HTML shell. It holds the Tailwind CSS script, Google Fonts (Orbitron & Rajdhani), and global CSS animations (keyframes for glowing, floating, spinning).
Edit this to: Change the browser tab title, add new fonts, or modify global CSS animations/colors.
_________(App.tsx)____________
What it contains: The main layout file. It acts as the traffic controller, stacking all the sections (Hero, About, Events, etc.) on top of each other. It also holds the global background (Background3D).
Edit this to: Reorder sections (e.g., move Team above Events), remove a section entirely, or add a new section component.
________(index.tsx)________
What it contains: The entry point that connects React to the browser.
Edit this to: You likely won't need to touch this.
3. Visual Components (The "Body")
These files determine how specific sections look.
__________(components/Navbar.tsx)________
Content: The top navigation bar (Logo, Links like "Home", "About").
Edit this to: Change the logo text ("METACLUB"), add new menu links, or change the mobile menu behavior.
________(components/Hero.tsx)
Content: The very first section with the big title "BUILD THE METAVERSE". It imports the HexagonHero animation.
Edit this to: Change the main headline, the sub-text, or the buttons ("Join The Club").
_________(components/About.tsx)________
Content: The "Mission/Vision" section and the tech stack grid (Metaverse, AI, Blockchain icons).
Edit this to: Change the mission statement text or the icons used for technologies.
________(components/Events.tsx)________
Content: The grid displaying events. It reads data from constants.ts.
Edit this to: Change how the event cards look (colors, borders) or change the filtering logic (Upcoming vs Completed).
___________(components/Updates.tsx)__________
Content: The "System Updates" notification box. It reads data from constants.ts.
Edit this to: Change the layout of the news feed.
components/Team.tsx
Content: The grid showing team members. It reads data from constants.ts.
Edit this to: Change the hexagon profile picture styling or social media icon layout.
___________(components/JoinForm.tsx)___________
Content: The "Join the Network" form.
Edit this to: Add new input fields (e.g., "Phone Number"), change form validation logic, or connect it to a real backend API.
_________(components/Footer.tsx)__________
Content: The bottom footer (Copyright, social links).
Edit this to: Update copyright year or footer links.
4. 3D & Animation Components (The "Magic")
These files handle the cool visual effects using Three.js or CSS animations.
__________(components/HexagonHero.tsx)_________
Content: The spinning 3D hexagon animation seen on the right side of the Home section.
Edit this to: Change the colors of the rings, rotation speed, or size of the hexagon.
_______(components/Background3D.tsx)_________
Content: The global background canvas that runs behind the entire website. It creates the "Starfield" and the moving grid floor.
Edit this to: Change the star speed, grid color, or background density.
components/EventsBackground3D.tsx
Content: The specific floating shapes background behind the Events section.
Edit this to: Change the floating geometric shapes (triangles/circles) that react to the mouse.
_______(components/Shapes3D.tsx)________
Content: Contains small decorative 3D items: Tesseract (spinning cube), FloatingCrystal (pyramids), and GyroScope (rings).
Edit this to: Modify specific decorative objects placed around the site.
________(components/HackerEarth.tsx)________
Content: An older component containing a 3D Earth globe.
Status: Currently unused (we replaced it with HexagonHero in the Hero section). You can delete this file if you don't plan to use the Earth globe anymore.
Summary Cheat Sheet
I want to change...	Go to file...
Event Name / Date / Location	constants.ts
Team Member Name / Role	constants.ts
Main "BUILD THE METAVERSE" Title	components/Hero.tsx
Logo Text	components/Navbar.tsx
Mission Statement Text	components/About.tsx
Background Stars/Grid	components/Background3D.tsx
Color Scheme (Global)	index.html (tailwind config section)