# FanForge Wireflow Specification

## Wireflow Overview

This document outlines the low-fidelity user interface flows for FanForge, covering both Creator and Brand Admin user journeys through the platform's core functionality.

## Screen Definitions

### S1: Landing Page

**Screen ID:** S1  
**Name:** Landing Page  
**User Type:** Anonymous  
**Elements:**

- Hero section with value proposition
- "Get Started" CTA button
- Feature highlights (Legal Protection, Official Assets, Creator Community)
- Login/Register navigation links
- Campaign showcase preview

**Next Screens:** S2 (Register), S3 (Login)

### S2: Registration

**Screen ID:** S2  
**Name:** User Registration  
**User Type:** Anonymous  
**Elements:**

- Email input field
- Password input field
- Confirm password field
- Role selection radio buttons (Creator / Brand Admin)
- "Create Account" button
- "Already have account? Login" link
- Terms of service checkbox

**Next Screens:** S4 (Creator Dashboard), S5 (Brand Dashboard)

### S3: Login

**Screen ID:** S3  
**Name:** User Login  
**User Type:** Anonymous  
**Elements:**

- Email input field
- Password input field
- "Remember me" checkbox
- "Login" button
- "Forgot password?" link
- "Need an account? Register" link

**Next Screens:** S4 (Creator Dashboard), S5 (Brand Dashboard)

### S4: Creator Dashboard

**Screen ID:** S4  
**Name:** Creator Discovery Dashboard  
**User Type:** Creator  
**Elements:**

- Top navigation (Discover, Create, Portfolio, Profile)
- Search bar with placeholder "Search campaigns..."
- Filter sidebar (Category, Deadline, Brand, Status)
- Featured campaigns grid
- Campaign cards with thumbnail, title, brand, deadline
- "Join Campaign" buttons
- Pagination controls

**Next Screens:** S6 (Campaign Details), S8 (Creation Canvas), S9 (Portfolio)

### S5: Brand Dashboard

**Screen ID:** S5  
**Name:** Brand Admin Dashboard  
**User Type:** Brand Admin  
**Elements:**

- Top navigation (Dashboard, Campaigns, Reviews, Analytics)
- Key metrics cards (Active Campaigns, Total Submissions, Pending Reviews)
- Recent activity feed
- Quick actions (Create Campaign, Review Submissions)
- Campaign performance chart
- Top performing campaigns list

**Next Screens:** S7 (Campaign Management), S10 (Submission Review), S11 (Campaign Creation)

### S6: Campaign Details

**Screen ID:** S6  
**Name:** Campaign Detail Page  
**User Type:** Creator  
**Elements:**

- Campaign header with title, brand logo, deadline
- Campaign description and guidelines
- Asset kit preview grid
- Requirements checklist
- "Join Campaign" primary button
- "Bookmark" secondary button
- Related campaigns section
- Back to discovery link

**Next Screens:** S8 (Creation Canvas), S4 (Back to Discovery)

### S7: Campaign Management

**Screen ID:** S7  
**Name:** Brand Campaign Management  
**User Type:** Brand Admin  
**Elements:**

- Campaign list table (Title, Status, Submissions, Deadline)
- Filter and sort controls
- "Create New Campaign" button
- Campaign status toggles (Draft, Active, Closed)
- Bulk actions dropdown
- Campaign performance metrics
- Edit/Delete action buttons

**Next Screens:** S11 (Create Campaign), S10 (Review Submissions)

### S8: Creation Canvas

**Screen ID:** S8  
**Name:** Creator Canvas Interface  
**User Type:** Creator  
**Elements:**

- Three-panel layout: Asset Palette | Canvas | Properties
- Asset palette with categorized tabs (Characters, Backgrounds, Logos, Props)
- Drag-and-drop canvas area
- Layer management panel
- Zoom and pan controls
- Save/Load project buttons
- "Submit Artwork" button
- Progress indicator

**Next Screens:** S12 (Submission Form), S4 (Save & Exit)

### S9: Creator Portfolio

**Screen ID:** S9  
**Name:** Creator Portfolio  
**User Type:** Creator  
**Elements:**

- Portfolio header with creator stats
- Approved works gallery grid
- Submission history table (Campaign, Status, Date, Feedback)
- Filter by status (All, Approved, Pending, Changes Requested)
- Achievement badges section
- Social sharing buttons
- Profile edit link

**Next Screens:** S4 (Back to Discovery), S13 (Profile Settings)

### S10: Submission Review

**Screen ID:** S10  
**Name:** Brand Submission Review  
**User Type:** Brand Admin  
**Elements:**

- Submission queue with thumbnails
- Filter by status and campaign
- Detailed submission view panel
- Creator information sidebar
- Campaign guidelines reference
- Approve/Request Changes buttons
- Feedback text area
- Batch selection checkboxes

**Next Screens:** S5 (Back to Dashboard), S7 (Campaign Management)

### S11: Campaign Creation

**Screen ID:** S11  
**Name:** Create New Campaign  
**User Type:** Brand Admin  
**Elements:**

- Multi-step form wizard
- Campaign details form (Title, Description, Guidelines)
- Asset upload interface with drag-and-drop
- Asset categorization tools
- Timeline and deadline picker
- Preview mode toggle
- Save as Draft/Publish buttons
- Progress indicator

**Next Screens:** S7 (Campaign Management), S5 (Dashboard)

### S12: Submission Form

**Screen ID:** S12  
**Name:** Artwork Submission  
**User Type:** Creator  
**Elements:**

- Artwork preview thumbnail
- Title input field
- Description textarea
- Creator notes textarea
- File upload confirmation
- Campaign requirements checklist
- "Submit for Review" button
- "Save as Draft" button
- Terms agreement checkbox

**Next Screens:** S9 (Portfolio), S4 (Discovery)

### S13: Profile Settings

**Screen ID:** S13  
**Name:** User Profile Management  
**User Type:** Creator/Brand Admin  
**Elements:**

- Profile photo upload
- Personal information form
- Portfolio links (for creators)
- Notification preferences
- Account security settings
- Theme selection (Light/Dark)
- "Save Changes" button
- "Delete Account" link

**Next Screens:** S4 (Creator Dashboard), S5 (Brand Dashboard)

## Primary User Flows

### Creator Flow: Discovery to Submission

**Flow:** S1 → S2 → S4 → S6 → S8 → S12 → S9
**Description:** New creator registers, discovers campaign, creates artwork, submits for review, views in portfolio

### Brand Admin Flow: Campaign Creation to Review

**Flow:** S1 → S2 → S5 → S11 → S7 → S10
**Description:** Brand admin registers, creates campaign with assets, manages campaigns, reviews submissions

### Returning User Flow: Login to Action

**Flow:** S1 → S3 → S4/S5 → [Primary Actions]
**Description:** Existing users login and access their role-specific dashboard

## Responsive Considerations

### Mobile Layout (320px - 767px)

- Single column layouts
- Collapsible navigation drawer
- Touch-optimized buttons (44px minimum)
- Simplified canvas interface with gesture controls
- Stacked form layouts

### Tablet Layout (768px - 1023px)

- Two-column layouts where appropriate
- Sidebar navigation
- Optimized canvas with touch and mouse support
- Grid layouts for campaign discovery

### Desktop Layout (1024px+)

- Full three-panel canvas interface
- Sidebar navigation with expanded labels
- Multi-column grids for content discovery
- Hover states and advanced interactions

## Accessibility Features

### Navigation

- Skip links for keyboard users
- ARIA landmarks and labels
- Focus indicators on all interactive elements
- Logical tab order throughout flows

### Content

- Alt text for all images and icons
- Descriptive link text
- Form labels and error messages
- Screen reader compatible status updates

### Interaction

- Keyboard shortcuts for canvas tools
- Voice-over support for drag-and-drop
- High contrast mode compatibility
- Reduced motion preferences respected
