# 🌳 Carbon Tree

<div align="center">

![Carbon Tree Banner](https://img.shields.io/badge/Carbon%20Footprint-Calculator-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-4.0-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-06B6D4?style=for-the-badge&logo=tailwind-css)

**Transform Your Carbon Footprint into a Thriving Virtual Forest** 🌿

[Live Demo](#-demo-link) • [GitHub Repo](#-github-repository) • [Features](#-features) • [Installation](#-installation--setup)

</div>

---

## 🌍 Problem Statement

**The Challenge:** Many people want to live sustainably but struggle to understand how their daily actions impact the environment. Existing carbon calculators present data as numbers and statistics—making it:

- ❌ Difficult to visualize real impact
- ❌ Demotivating to track progress
- ❌ Easy to lose interest over time
- ❌ Hard to understand behavioral change

**The Insight:** People respond better to **visual, interactive experiences** that show progress in real-time. A growing forest is far more motivating than a number.

---

## 💡 Solution

**Carbon Tree** transforms carbon footprint tracking into an engaging, gamified experience:

🎮 Answer quick daily sustainability questions about your lifestyle choices  
📊 Receive instant carbon footprint estimates  
🌱 Watch your virtual forest grow with every eco-friendly action  
🦋 Unlock wildlife, flowers, and magical elements as you progress  
🏆 Earn achievements and complete seasonal missions  
📖 Discover stories about your forest's journey  
🌙 Enjoy a beautiful nature-inspired interface (Light & Dark modes)  

### **Core Philosophy**
> *Make sustainability visible, engaging, and rewarding—one tree at a time.*

---

## ✨ Features

### 📱 **Daily Eco Check-In**
- 🚗 Transportation choices (Public Transit, Cycling, Electric Vehicle, etc.)
- 🥗 Meal type tracking (Plant-based, Mixed Diet, Meat-heavy)
- 💡 Energy usage monitoring
- 💧 Water conservation tracking
- ♻️ Recycling and waste management
- 🛍️ Sustainable shopping habits
- Quick-answer format (15-30 seconds per check-in)

### 🌲 **Interactive Forest Visualization**

| **Level** | **Progression** | **Elements** |
|-----------|-----------------|-------------|
| 🏜️ **Level 1** | Starting Point | Dry land, small stumps |
| 🌱 **Level 2** | Early Growth | Small saplings, first soil enrichment |
| 🌳 **Level 3** | Thriving | 8-12 visible trees, flowers, butterflies, rabbits |
| 🌲 **Level 4** | Dense Forest | 20+ trees, birds, deer, rich biodiversity |
| ✨ **Level 5** | Magical Forest | Glowing trees, fireflies, mystical atmosphere, particle effects |

**Ecosystem Elements:**
- 🌳 Trees that scale with carbon savings
- 🌸 Flowers that bloom progressively
- 🦋 Butterflies and moths (day & night variants)
- 🐰 Forest animals (rabbits, deer, birds, squirrels)
- ✨ Magical particles and ambient effects
- 🌙 Day/Night dynamic lighting

### 🎯 **Missions & Achievements**

- 🎯 **Active Missions**: Time-limited sustainability challenges
- 🏅 **Achievements**: Unlock badges for milestones
- 🎁 **Rewards**: Unlock rare animals and forest decorations
- 📊 **Leaderboards**: Compare progress with friends (coming soon)

### 📖 **Forest Chronicle**

Personalized storytelling that narrates your forest's journey:
- *"The Month of Quiet Roots"*
- *"Blossoming Hope"*
- *"When Butterflies Returned"*
- Dynamic narratives based on user actions

### 🌍 **Community Features**

- 👥 Share your forest with friends
- 💬 View other users' forests
- 🤝 Collaborative challenges
- 🌐 Global sustainability impact tracking

### 🎨 **Beautiful UI/UX**

- 🌞 **Light Mode**: Vibrant, energetic color palette
- 🌙 **Dark Mode**: Soft glowing effects, bioluminescent highlights
- 📐 **Isometric Visualization**: 3D perspective forest view
- ♿ **Accessible**: WCAG AA compliant, keyboard navigation
- 📱 **Responsive**: Mobile, tablet, and desktop optimized

---

## 🎮 How It Works

### **User Flow**
### **Carbon Scoring System**

Each daily choice contributes to forest growth:

```javascript
🚗 Transportation:
   ├─ Public Transit: +5 carbon saved
   ├─ Cycling: +8 carbon saved
   ├─ Electric Vehicle: +6 carbon saved
   └─ Personal Car: -2 carbon

🥗 Meals:
   ├─ Plant-based: +5 carbon saved
   ├─ Mostly Plant-based: +3 carbon saved
   ├─ Mixed Diet: 0 carbon
   └─ Meat-heavy: -5 carbon

💡 Energy:
   ├─ Conserved: +4 carbon saved
   ├─ Normal: 0 carbon
   └─ Heavy Usage: -3 carbon

💧 Water:
   ├─ Saved Water: +4 carbon saved
   ├─ Average: 0 carbon
   └─ Long Shower: -2 carbon

♻️ Recycling:
   ├─ Recycled Everything: +6 carbon saved
   ├─ Mostly Recycled: +3 carbon saved
   └─ Some Waste: -1 carbon

🛍️ Shopping:
   ├─ Sustainable: +8 carbon saved
   ├─ Regular Purchase: 0 carbon
   └─ Fast Fashion: -4 carbon
```

**Forest Growth:**
- Accumulate daily scores
- Reach milestones to unlock new forest elements
- Level up every 500 carbon points saved
- Permanent progress (no resets)

---

## 🏗️ Tech Stack

### **Frontend**
- **React 18.2** - UI library with hooks
- **TypeScript 5.3** - Type-safe development
- **Vite 4.0** - Lightning-fast build tool
- **Tailwind CSS 3.4** - Utility-first styling
- **TanStack Router** - Client-side routing

### **UI Components**
- **Lucide React** - Beautiful SVG icons
- **SVG Animations** - Custom tree and forest visualizations
- **CSS Keyframes** - Smooth animations and transitions

### **State Management**
- React Context API
- Custom hooks for forest state
- localStorage for persistence

### **Development Tools**
- ESLint + Prettier - Code quality
- TypeScript strict mode
- Git version control

---

## 🚀 Installation & Setup

### **Prerequisites**
- Node.js 18+ ([Download](https://nodejs.org/))
- npm 9+ or yarn 3+
- Git

### **Step 1: Clone Repository**
```bash
git clone https://github.com/R4039/Carbon-Footprint.git
cd Carbon-Footprint
```

### **Step 2: Install Dependencies**
```bash
npm install
# or
yarn install
```

### **Step 3: Create Environment Variables**
Create `.env.local` in the root directory:
```env
VITE_API_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=your_firebase_key_here
VITE_GEMINI_API_KEY=your_gemini_key_here
```

### **Step 4: Start Development Server**
```bash
npm run dev
# or
yarn dev
```

The app will open at `http://localhost:5173`

### **Step 5: Build for Production**
```bash
npm run build
# or
yarn build
```

---

## 💻 Local Development

### **Project Structure**
### **Available Scripts**
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # TypeScript check
```

### **Git Workflow**
```bash
git checkout -b feature/your-feature-name
git commit -am "Add: description of changes"
git push origin feature/your-feature-name
```

---

## 📸 Screenshots

### **Dashboard - Light Mode**
![Dashboard Light](./docs/screenshots/dashboard-light.png)
*Interactive forest visualization with growth tracking*

### **Dashboard - Dark Mode**
![Dashboard Dark](./docs/screenshots/dashboard-dark.png)
*Beautiful night mode with bioluminescent effects*

### **Daily Check-In**
![Check-In](./docs/screenshots/check-in.png)
*Quick sustainability questions*

### **Forest Progression**
![Forest Levels](./docs/screenshots/forest-levels.png)
*Level 1 through Level 5 forest evolution*

### **Achievements & Missions**
![Achievements](./docs/screenshots/achievements.png)
*Unlock badges and complete challenges*

---

## 🎯 Feature Highlights

### **Real-Time Feedback**
✅ Trees grow immediately after check-in  
✅ Butterflies and flowers spawn progressively  
✅ Achievements unlock with celebration animations  
✅ Sound effects on milestones (optional)

### **Gamification**
✅ Daily streaks  
✅ Seasonal missions  
✅ Unlockable animals  
✅ Achievement badges  
✅ Progress leaderboards (coming soon)

### **Storytelling**
✅ Personalized forest narratives  
✅ Dynamic stories based on user actions  
✅ Chronicle updates monthly  
✅ Emotional connection to progress

### **Sustainability Impact**
✅ Real carbon calculations  
✅ Visual representation of savings  
✅ Comparison with average footprint  
✅ Educational insights

---

## 🌟 Unique Selling Points

| Feature | Benefit |
|---------|---------|
| **Gamified Experience** | Stay motivated with visual progress |
| **Beautiful Visualization** | Engage users through stunning graphics |
| **Accessible Design** | Works for everyone, everywhere |
| **Educational** | Learn about sustainability naturally |
| **Social Sharing** | Inspire friends and family |
| **Persistent Progress** | Forest never resets, always growing |
| **Day/Night Themes** | Comfortable to use anytime |

---

## 🔮 Future Scope

### **Phase 2 (Q3 2026)**
- [ ] Firebase Backend Integration
- [ ] User Authentication
- [ ] Cloud Save & Sync
- [ ] Social Features (friends, groups)
- [ ] Global Leaderboards

### **Phase 3 (Q4 2026)**
- [ ] Mobile App (React Native)
- [ ] AR Forest Preview
- [ ] Smart Watch Integration
- [ ] Notifications & Reminders
- [ ] API for Third-party Apps

### **Phase 4 (2027)**
- [ ] AI-powered Suggestions
- [ ] Carbon Offset Marketplace
- [ ] Integration with Smart Home Devices
- [ ] Blockchain Carbon Credits
- [ ] Educational Partnerships

---

## 📊 Metrics & Impact

**Project Goals:**
- 🎯 10,000+ active users by end of year
- 🌍 Track 50+ tons of CO2 saved collectively
- 🌳 Visualize 100,000+ virtual trees grown
- 🤝 Build engaged sustainability community

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Development Guidelines**
- Follow existing code style
- Use TypeScript with strict mode
- Add tests for new features
- Update documentation
- Keep components small and focused

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

---

## 👥 Team Members

<table>
  <tr>
    <td align="center">
      <img src="https://img.shields.io/badge/Rucha%20Keskar-Developer-green?style=for-the-badge" />
      <br>
      <sub><b>Lead Developer</b></sub>
      <br>
      <a href="https://github.com/R4039">@R4039</a>
    </td>
  </tr>
</table>

**Want to join the team?** Reach out or contribute to the project!

---

## 🔗 Links

### **Live Demo**
🌐 **[Visit Carbon Tree Live](https://carbon-tree-demo.vercel.app)**

### **GitHub Repository**
📚 **[Carbon-Footprint on GitHub](https://github.com/R4039/Carbon-Footprint)**

### **Project Resources**
- 📖 [Documentation](./docs/README.md)
- 🐛 [Report Issues](https://github.com/R4039/Carbon-Footprint/issues)
- 💬 [Discussions](https://github.com/R4039/Carbon-Footprint/discussions)
- 📧 [Contact Us](mailto:rucha@example.com)

---

## 🎓 Learning & Credits

### **Inspiration**
- 🌍 UN Sustainable Development Goals
- 🎮 Gamification principles
- 🎨 Nature-inspired design
- 💚 Environmental activism

### **Technologies Learned**
- Modern React patterns (hooks, context, suspense)
- TypeScript best practices
- CSS animations and transitions
- Responsive web design
- State management strategies

---

## 💬 Feedback & Support

Have questions or suggestions? We'd love to hear from you!

- **Report a Bug**: [GitHub Issues](https://github.com/R4039/Carbon-Footprint/issues)
- **Feature Request**: [Create a Discussion](https://github.com/R4039/Carbon-Footprint/discussions)
- **General Feedback**: [Email](mailto:rucha@example.com)

---

## 🌱 Make a Difference

Every small action counts. With Carbon Tree, you can:
- 🌍 Reduce your carbon footprint
- 🌳 Grow a beautiful virtual forest
- 🤝 Inspire others to be sustainable
- 🎯 Track your environmental impact

**Start your forest journey today!**

---

<div align="center">

### Made with 💚 by [Rucha Keskar](https://github.com/R4039)

⭐ If you like this project, please give it a star! ⭐

[![GitHub Stars](https://img.shields.io/github/stars/R4039/Carbon-Footprint?style=social)](https://github.com/R4039/Carbon-Footprint)
[![GitHub Forks](https://img.shields.io/github/forks/R4039/Carbon-Footprint?style=social)](https://github.com/R4039/Carbon-Footprint/fork)

**Let's grow a greener future, together.** 🌍🌳

</div>
