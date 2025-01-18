# Team Racial Harmony

Our team is called 'Racial Harmony' to reflect the diversity within our group, as we come from different nationalities and cultural backgrounds. This name celebrates our unity and collaboration, highlighting the strength that comes from embracing our differences to work together towards a common goal.

# Web based minimart and voucher system

Personalized minimart with customizable themes: residents track vouchers and view spending insights, while admins manage inventory, access reports, and see class-wide trends—all seamlessly automated

## Try it out
Link to webapp: [Racial Harmony](https://racial-harmony-5.web.app/)
Test **Resident** account: resident@gmail.com (password: test123)
Test **Admin** account: admin@rh.com (password: test123)

**Note** 
- Batch Creation of users in Admin's Manage page - The excel file uploaded should contain the following columns: name, admission date, birthday, class, admin (boolean true/false), profile picture url (this is optional)

## Inspiration
Our project for Muhammadiyah was inspired by the organization's longstanding commitment to social cohesion, community support, and inclusivity. 

With our personalisation and gamification features that encourages residents to actively participate in the voucher system, and automated processes of user and product batch creations and updates, we hope our webapp offers a seamless experience for the residents and admins 

## Features

### For Residents (Users):

#### **Home Dashboard**
- Provides a streamlined overview of:
  - **Favorite Vouchers**: Quick access to the resident’s most loved vouchers.
  - **Favorite Products**: A curated list of frequently chosen products.
  - **Voucher Balance**: Displays the current balance for ease of tracking.
  - **Recent Transactions**: View the latest transactions at a glance.
- Displays any **ongoing auctions**.

#### **Minimart Page**
- **Search Bar** and **Category Filter**: Search and filter products efficiently.
- **Product Navigation**:
  - Clicking on a product navigates to the **Product Page**, where residents can:
    - Request a specific quantity of the product to add to their cart.
    - Add the product to their favorites.
- **Wishlist for Products**
  - Add unavailable or desired products to a personal wishlist.
  - Admins gain insights into product demand and can prioritize restocking.
- **Voucher Balance Check**:
  - Residents cannot request a quantity of products if the required voucher points exceed their balance.
- **Persistent Search**:
  - Residents can continue searching from the product page, which navigates them back to the Minimart page with the search query applied.

#### **Cart**
- After adding products to the cart:
  - Residents can check out the items at the physical minimart.
  - A **QR code** is generated for the cashier/staff to scan and complete the transaction.
  - The resident’s **voucher balance** updates automatically.

#### **Vouchers**
Tasks Gallery Page
- Earn voucher points by completing tasks displayed on the voucher page.
- **Search Bar** and **Category Filter**: Quickly find specific tasks.
- **Gamified Tasks**:
  - **Personal Tasks**: E.g., Maintain punctuality for a week to earn vouchers.
  - **Group Tasks**: Collaborate to clean the courtyard or organize an event for group rewards.
- Clicking on a task provides an overview of the task details.
  - **View Details**: Navigates to the Task Page.
  - Residents can add tasks to their favorites.

Task Page
- Residents can:
  - Submit an application for completed tasks by pressing the **Apply** button.
  - Admins will review the application and either approve or reject it.



#### **Leaderboard & Achievement Badges**
- **Monthly Leaderboard**: based on the voucher points earned within the month.
- **Milestone Badges**:
  - Earn badges for achievements such as consistent good behavior, academic improvement, or completing community tasks.
  - Badges incentivize participation with small voucher bonuses.
 
 #### **History**
- View overall voucher balance.
- Access logs of all approved task applications.

 #### **Profie**
- **Personalization**: Add a personal touch with customizable wallpapers and profile settings.
---

### For Admins (Staff):

#### **Inventory Analytics**
- View analytics for popular or frequently requested products.
- Gain insights into wishlist trends to adjust inventory based on demand.

#### **User Management System**
- Add, suspend, and reset user passwords.
- Automatically create a batch of users or upload batch of inventory via batch create functions

####  Task and Request Approval  
- Create voucher tasks
- Approve or reject voucher tasks and product requests with detailed tracking of actions.

####  Inventory Management  
- Tools to manage stock levels and ensure availability of popular items.  
- Audit logs for transparency and accountability.


#### **Future Plans**
- **Notifications System**:
  - **For Residents**: Alerts for voucher issuance, approvals, rejections, or auction outcomes.
  - **For Admins**: Notifications for pending approvals, low inventory, or upcoming auctions.
- **Community Board**: 
  - A virtual noticeboard for updates, goals, and upcoming events.
  - Interaction between residents and admins to foster a sense of community.

---


This system is designed to enhance efficiency, provide transparency, and deliver a seamless experience for all users.

## How we built it
We utilized a user-centered approach to design and development:
1. **Frameworks & Tools**: React for the front-end, Node.js for the back-end, and Firebase for real-time data synchronization.
2. **Client Research**: We conducted in-depth research on Muhammadiyah to ensure the platform aligns with their mission and values.
3. **Focus on Accessibility**: Ensuring the platform is inclusive and easy to use for individuals of all backgrounds and abilities.

## Challenges we ran into
1. **Identifying Key Needs**: Determining the most impactful features to address the needs of youth-at-risk.
2. **Resource Limitations**: Working within a limited timeline to develop a functional and scalable prototype.
3. **Engagement Strategies**: Designing features that effectively motivate youth participation and sustained engagement.

## Accomplishments that we're proud of
- Successfully launching a platform prototype within the project timeline.
- Building a scalable foundation that can be adapted for future initiatives across different regions or organizations.

## What we learned
- Successfully delivering a functional prototype that aligns with Muhammadiyah's objectives.
- Developing a robust and scalable platform foundation for future enhancements.

## What's next for Racial Harmony
1. **Feature Expansion**: Adding personalized recommendations for events, initiatives, and other opportunities.
2. **Broader Deployment**: Scaling the platform for use by other organizations or communities.
3. **Impact Metrics**: Implementing tools to measure the platform's effectiveness in fostering community engagement.
4. **Mobile Accessibility**: Developing a mobile application to increase usability and reach.
5. **User Feedback Integration**: Continuously improving the platform based on user input and evolving community needs.

We believe this project has the potential to make a meaningful difference and are excited to continue evolving it to support Muhammadiyah's vision of unity and growth. This project represents our commitment to building tools that make a meaningful difference in community development and engagement.

