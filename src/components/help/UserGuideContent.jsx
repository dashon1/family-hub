
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; // Added Button import
import { 
  Home, 
  Calendar, 
  CheckSquare, 
  ShoppingCart, 
  UtensilsCrossed, 
  Mic, 
  Eye, 
  Users,
  Plus,
  Copy,
  Trash2,
  Edit,
  Settings,
  AlertCircle,
  MessageCircle // Added MessageCircle import
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const UserGuides = {
  quickStart: {
    title: "Quick Start Guide",
    icon: <Home className="w-6 h-6" />,
    sections: [
      {
        title: "Welcome to FamilyHub!",
        content: `FamilyHub is your all-in-one family coordination platform. Whether you're managing a busy household of five or coordinating with extended family across multiple locations, FamilyHub keeps everyone connected and organized.`,
        steps: []
      },
      {
        title: "Step 1: Create Your First Household",
        content: `Every journey with FamilyHub begins with creating a household. Think of a household as your family's digital home base.`,
        steps: [
          {
            number: 1,
            title: "Navigate to Household Management",
            description: "Click on 'Households' in the sidebar menu. You'll see a clean dashboard with options to create or join a household."
          },
          {
            number: 2,
            title: "Click 'Create New Household'",
            description: "You'll see a bright orange card with a plus icon. Click anywhere on this card to get started."
          },
          {
            number: 3,
            title: "Name Your Household",
            description: "Choose a name that makes sense for your family. Popular examples: 'The Smiths', 'Johnson Family', 'Our Home', 'Mom & Kids'. The name can be anything you like!"
          },
          {
            number: 4,
            title: "Save and Get Your Invite Code",
            description: "Click 'Create Household' and you'll instantly see your new household appear with a unique invite code (like 'A7BC5X2D'). This code is how you'll invite family members!"
          }
        ],
        tips: [
          "You automatically become the admin of any household you create",
          "You can create multiple households (great for blended families, roommates, or extended family)",
          "Your household name can be changed later by the admin"
        ]
      },
      {
        title: "Step 2: Invite Family Members",
        content: `Once your household exists, it's time to bring the family onboard!`,
        steps: [
          {
            number: 1,
            title: "Find Your Invite Code",
            description: "On your household card, you'll see a section labeled 'Invite Code' with a code like 'A7BC5X2D'"
          },
          {
            number: 2,
            title: "Copy the Code",
            description: "Click the copy icon next to your invite code. You'll see a green checkmark confirming it's copied."
          },
          {
            number: 3,
            title: "Share with Family",
            description: "Send the code to family members via text, email, or any messaging app. Tell them to create a FamilyHub account and use the 'Join a Household' option."
          },
          {
            number: 4,
            title: "They Join",
            description: "Family members will click 'Join a Household' on the Household Management page, enter your code, and click 'Join'. They're instantly connected!"
          }
        ],
        tips: [
          "Invite codes never expire - share them anytime",
          "New members see all household data immediately",
          "You can see all household members listed on your household card"
        ]
      },
      {
        title: "Step 3: Customize Your Experience",
        content: `Before diving in, take a moment to personalize your profile.`,
        steps: [
          {
            number: 1,
            title: "Go to Settings",
            description: "Click 'Settings' in the sidebar menu."
          },
          {
            number: 2,
            title: "Choose Your Display Color",
            description: "Pick a color that represents you. This color will appear on all your events and tasks, making it easy for family to know who created what. Choose from 8 vibrant colors!"
          },
          {
            number: 3,
            title: "Add Your Phone Number",
            description: "Optional, but helpful for notifications and contact info."
          },
          {
            number: 4,
            title: "Save Changes",
            description: "Click 'Save Changes' at the bottom. Your profile is now personalized!"
          }
        ]
      },
      {
        title: "Step 4: Start Using FamilyHub",
        content: `You're all set! Here's what to do next:`,
        steps: [
          {
            number: 1,
            title: "Add Your First Event",
            description: "Go to Family Calendar and click 'Add Event'. Create an event for something upcoming - a doctor's appointment, soccer practice, or family dinner."
          },
          {
            number: 2,
            title: "Create a Task",
            description: "Go to Family Tasks and click 'Add Task'. Create a simple task like 'Take out trash' or 'Buy groceries' and assign it to someone."
          },
          {
            number: 3,
            title: "Start a Grocery List",
            description: "Go to Grocery Lists and use the Quick Add box. Type or speak a few items you need. Try clicking the microphone icon for voice input!"
          },
          {
            number: 4,
            title: "Explore the Dashboard",
            description: "Return to the Dashboard to see your day at a glance. This is your command center!"
          }
        ]
      }
    ]
  },

  calendar: {
    title: "Calendar Management",
    icon: <Calendar className="w-6 h-6" />,
    sections: [
      {
        title: "Understanding the Family Calendar",
        content: `The Family Calendar is your central hub for coordinating everyone's schedules. It shows events across all family members in one unified view, with color-coding to identify who's doing what.`,
        steps: []
      },
      {
        title: "Creating Events",
        content: `Events are the building blocks of your family schedule.`,
        steps: [
          {
            number: 1,
            title: "Click 'Add Event'",
            description: "From the Family Calendar page, click the bright orange 'Add Event' button in the top right."
          },
          {
            number: 2,
            title: "Fill in Event Details",
            description: "Event Title: Give it a clear name (e.g., 'Soccer Practice', 'Doctor Appointment', 'Family Dinner')\n\nDate & Time: Choose the start date and optionally end date. For all-day events, check the 'All day event' box.\n\nTime: If it's not all-day, set start and end times.\n\nLocation: Add where it's happening (optional but useful for appointments and activities)"
          },
          {
            number: 3,
            title: "Choose a Category",
            description: "Select from: Work, School, Activity, Appointment, Family, or Personal. Categories help organize and color-code your events."
          },
          {
            number: 4,
            title: "Set Visibility",
            description: "My Household Only: Only your current household sees this event\n\nAll My Households: Visible across all households you belong to\n\nPrivate (Just Me): Only you can see it"
          },
          {
            number: 5,
            title: "Add Recurring Pattern (Optional)",
            description: "For repeating events, choose: Daily, Weekly, Biweekly, or Monthly. Great for sports practice, work schedules, or regular appointments."
          },
          {
            number: 6,
            title: "Use Voice Input",
            description: "Click the microphone icon next to any text field to speak instead of type. Perfect for quick entry!"
          }
        ],
        tips: [
          "Use descriptive titles so family knows what's happening at a glance",
          "Add locations for appointments so everyone knows where to go",
          "Color-code by category for quick visual scanning",
          "Set recurring events once instead of creating them manually each week"
        ]
      },
      {
        title: "Viewing the Calendar",
        content: `The calendar displays all family events in an intuitive monthly grid.`,
        steps: [
          {
            number: 1,
            title: "Navigate Months",
            description: "Use the ← and → arrows to move between months, or click 'Today' to jump to the current date."
          },
          {
            number: 2,
            title: "Select a Date",
            description: "Click on any date to see that day's events in the sidebar. You'll see full details including times, locations, and descriptions."
          },
          {
            number: 3,
            title: "View Event Details",
            description: "Click on any event card (either in the calendar grid or sidebar) to see full details, edit, or delete it."
          },
          {
            number: 4,
            title: "Quick Add from Calendar",
            description: "Click on an empty date cell and click the small '+ Add' button to create an event for that specific day."
          }
        ]
      },
      {
        title: "Managing Events",
        content: `Keep your calendar up-to-date with easy editing and deletion.`,
        steps: [
          {
            number: 1,
            title: "Edit an Event",
            description: "Click on the event, then click the pencil/edit icon. Make your changes and click 'Update Event'."
          },
          {
            number: 2,
            title: "Delete an Event",
            description: "Click on the event, then click the trash icon. Confirm deletion. This cannot be undone!"
          },
          {
            number: 3,
            title: "Bulk Management",
            description: "For recurring events, editing one instance asks if you want to update all future occurrences or just that one."
          }
        ],
        tips: [
          "Only the event creator or household admin can edit events",
          "Changes sync immediately across all family members' views",
          "Deleted events cannot be recovered - double check before deleting!"
        ]
      },
      {
        title: "Advanced Calendar Features",
        content: `Power user tips for maximum productivity.`,
        steps: [
          {
            number: 1,
            title: "Color Coordination",
            description: "Each family member's events show in their chosen display color (set in Settings). This makes it easy to see everyone's schedule at a glance."
          },
          {
            number: 2,
            title: "All-Day Events",
            description: "Check 'All day event' for things like birthdays, holidays, or vacation days. These appear at the top of the date cell."
          },
          {
            number: 3,
            title: "Privacy Controls",
            description: "Use 'Private' visibility for personal appointments you don't want to share with the household. Use 'Shared' to show across all your households."
          },
          {
            number: 4,
            title: "Quick Stats",
            description: "The dashboard shows today's events at a glance, so you can see what's coming up without opening the full calendar."
          }
        ]
      }
    ]
  },

  tasks: {
    title: "Task Organization",
    icon: <CheckSquare className="w-6 h-6" />,
    sections: [
      {
        title: "Task Management Basics",
        content: `Family Tasks helps you organize household chores, personal to-dos, and shared responsibilities. Keep everyone accountable and track what needs to be done.`,
        steps: []
      },
      {
        title: "Creating Tasks",
        content: `Turn your to-do list into action.`,
        steps: [
          {
            number: 1,
            title: "Click 'Add Task'",
            description: "From the Family Tasks page or Dashboard, click the 'Add Task' button."
          },
          {
            number: 2,
            title: "Enter Task Details",
            description: "Task Title: Clear, action-oriented (e.g., 'Take out trash', 'Pay electric bill', 'Buy birthday gift')\n\nDescription: Add details, instructions, or notes\n\nDue Date: When it needs to be completed\n\nPriority: Low, Medium, High, or Urgent"
          },
          {
            number: 3,
            title: "Choose a Category",
            description: "Household: Shared chores and home maintenance\nPersonal: Individual to-dos\nWork: Job-related tasks\nSchool: Homework and projects\nErrands: Shopping and outside tasks\nOther: Everything else"
          },
          {
            number: 4,
            title: "Assign to Someone",
            description: "Enter the email of the family member responsible. They'll see it in their task list. Leave blank for unassigned tasks."
          },
          {
            number: 5,
            title: "Set Visibility",
            description: "Choose who can see this task (same options as events: household, shared, or private)."
          },
          {
            number: 6,
            title: "Make it Recurring (Optional)",
            description: "For regular chores, set Daily, Weekly, Biweekly, or Monthly recurrence."
          }
        ],
        tips: [
          "Use action verbs in titles: 'Buy groceries' not just 'Groceries'",
          "Set realistic due dates - you can always adjust them later",
          "High and Urgent priorities show in red/orange for visibility",
          "Recurring tasks automatically regenerate when completed"
        ]
      },
      {
        title: "Managing Task Status",
        content: `Track progress from start to finish.`,
        steps: [
          {
            number: 1,
            title: "Task States",
            description: "Pending: Not started yet (default)\nIn Progress: Currently working on it\nCompleted: All done!"
          },
          {
            number: 2,
            title: "Change Status",
            description: "Click on a task card to open details, then use the status dropdown to change its state. Or drag tasks between columns if you prefer."
          },
          {
            number: 3,
            title: "Filter by Status",
            description: "Use the filter buttons at the top to view:\n• All Tasks\n• Pending\n• In Progress\n• Completed"
          },
          {
            number: 4,
            title: "Overdue Alerts",
            description: "Tasks past their due date automatically show in red with a warning icon."
          }
        ]
      },
      {
        title: "Task Priority System",
        content: `Understand what needs attention first.`,
        steps: [
          {
            number: 1,
            title: "Low Priority (Blue)",
            description: "Nice to do, but not time-sensitive. These can wait if needed."
          },
          {
            number: 2,
            title: "Medium Priority (Yellow)",
            description: "Normal priority. Should be done on time but not urgent."
          },
          {
            number: 3,
            title: "High Priority (Orange)",
            description: "Important! Should be completed soon. Family will see these stand out."
          },
          {
            number: 4,
            title: "Urgent Priority (Red)",
            description: "Do this NOW! Time-sensitive or critical tasks. Gets everyone's attention."
          }
        ],
        tips: [
          "Don't mark everything as urgent - save it for real emergencies",
          "Review priorities weekly to keep them accurate",
          "High/Urgent tasks appear first in filtered views"
        ]
      },
      {
        title: "Recurring Tasks",
        content: `Set it once, never worry about it again.`,
        steps: [
          {
            number: 1,
            title: "When to Use Recurring",
            description: "Perfect for:\n• Daily: Make beds, feed pets, check mail\n• Weekly: Trash day, lawn mowing, laundry\n• Biweekly: Pay bills, deep clean\n• Monthly: Change air filters, review budgets"
          },
          {
            number: 2,
            title: "How it Works",
            description: "When you mark a recurring task as complete, it automatically creates a new instance with the next due date."
          },
          {
            number: 3,
            title: "Edit Recurring Tasks",
            description: "Changes apply to future instances. Past completed tasks remain unchanged."
          }
        ]
      },
      {
        title: "Task Dashboard & Quick Stats",
        content: `Get insights into family productivity.`,
        steps: [
          {
            number: 1,
            title: "Task Stats Cards",
            description: "See at a glance: Pending, In Progress, and Completed task counts."
          },
          {
            number: 2,
            title: "Dashboard Preview",
            description: "Your personal dashboard shows your top 5 upcoming tasks, prioritized by due date and urgency."
          },
          {
            number: 3,
            title: "Filters and Search",
            description: "Use filters to find exactly what you need. Combine status filters with category filters for precision."
          }
        ]
      }
    ]
  },

  shopping: {
    title: "Shopping & Meal Planning",
    icon: <ShoppingCart className="w-6 h-6" />,
    sections: [
      {
        title: "Grocery Lists",
        content: `Never forget an item again! Shared grocery lists keep everyone in sync, whether you're at the store or adding items from home.`,
        steps: []
      },
      {
        title: "Quick Add Items",
        content: `The fastest way to add items to your list.`,
        steps: [
          {
            number: 1,
            title: "Use the Quick Add Box",
            description: "At the top of the Grocery Lists page, you'll see a 'Quick Add' card. This is your fastest entry point."
          },
          {
            number: 2,
            title: "Type or Speak",
            description: "Type the item name, OR click the microphone icon and speak it aloud. Voice input is incredibly fast!"
          },
          {
            number: 3,
            title: "Hit Add",
            description: "Click 'Add' or press Enter. The item appears instantly in your list."
          },
          {
            number: 4,
            title: "Repeat",
            description: "Keep adding items one after another. It's lightning-fast!"
          }
        ],
        tips: [
          "Voice input works great while cooking - just speak what you need",
          "Quick Add defaults to 'Other' category, but you can change it later",
          "Multiple family members can add items simultaneously"
        ]
      },
      {
        title: "Detailed Item Entry",
        content: `Add more information for specific items.`,
        steps: [
          {
            number: 1,
            title: "Click 'Add Item'",
            description: "Use the main 'Add Item' button for the full entry form."
          },
          {
            number: 2,
            title: "Fill in Details",
            description: "Item Name: What you're buying\nCategory: Produce, Dairy, Meat, Pantry, Frozen, Bakery, Household, or Other\nQuantity: How much (e.g., '2', '1 lb', '3 boxes')\nEstimated Cost: Optional budget tracking\nNotes: Specific brands, preferences, or instructions"
          },
          {
            number: 3,
            title: "Save",
            description: "Click 'Add Item' to save it to your list."
          }
        ]
      },
      {
        title: "Shopping at the Store",
        content: `Use your list efficiently while shopping.`,
        steps: [
          {
            number: 1,
            title: "Filter by Category",
            description: "Click category buttons (Produce, Dairy, etc.) to show only items from that aisle. Shop section by section!"
          },
          {
            number: 2,
            title: "Check Off Items",
            description: "Click the checkbox next to each item as you add it to your cart. It moves to the bottom with a strikethrough."
          },
          {
            number: 3,
            title: "Add Actual Cost (Optional)",
            description: "While shopping, you can click on an item and enter the actual price paid. Great for budget tracking!"
          },
          {
            number: 4,
            title: "Clear Completed",
            description: "After shopping, click 'Clear Completed' to remove all checked items at once."
          }
        ],
        tips: [
          "Keep your phone's screen awake while shopping",
          "Family can add items to the list while you're at the store",
          "Categories roughly match store layout for efficient shopping"
        ]
      },
      {
        title: "Meal Planning",
        content: `Plan your family's meals for the entire week.`,
        steps: [
          {
            number: 1,
            title: "Navigate to Meal Planner",
            description: "From the sidebar, click 'Meal Planner' to see your weekly grid."
          },
          {
            number: 2,
            title: "View the Week",
            description: "You'll see a calendar-style grid with rows for Breakfast, Lunch, and Dinner, and columns for each day of the week."
          },
          {
            number: 3,
            title: "Add a Meal",
            description: "Click 'Add Meal' at the top, or click on a specific day/meal slot to add directly."
          },
          {
            number: 4,
            title: "Enter Meal Details",
            description: "Meal Name: What you're making (e.g., 'Spaghetti Bolognese', 'Chicken Tacos')\nMeal Type: Breakfast, Lunch, Dinner, or Snack\nDate: When you're planning to make it\nRecipe URL: Paste a link to the recipe (optional)\nIngredients: List what you need\nNotes: Cooking tips, prep time, etc."
          },
          {
            number: 5,
            title: "Add Ingredients to Grocery List",
            description: "Here's the magic: Click the shopping cart icon on any meal card to automatically add all ingredients to your grocery list!"
          }
        ],
        tips: [
          "Plan meals on Sunday for the whole week",
          "Use the recipe URL field to save favorites",
          "Click the link icon to open recipes while cooking",
          "Copy successful weeks to future weeks"
        ]
      },
      {
        title: "Smart Shopping Workflows",
        content: `Combine meal planning and grocery lists for maximum efficiency.`,
        steps: [
          {
            number: 1,
            title: "The Weekly Routine",
            description: "1. Plan meals for the week in Meal Planner\n2. Add all ingredients to grocery list with one click\n3. Review and add any household items needed\n4. Go shopping with your organized list\n5. Check off items as you shop\n6. Clear completed items when done"
          },
          {
            number: 2,
            title: "Running Lists",
            description: "Keep a 'running list' going all week. When you run out of something, immediately add it to the list. By shopping day, everything's there!"
          },
          {
            number: 3,
            title: "Budget Tracking",
            description: "Use estimated costs before shopping, actual costs during shopping, then compare to track spending trends."
          }
        ]
      }
    ]
  },

  advanced: {
    title: "Advanced Features",
    icon: <Settings className="w-6 h-6" />,
    sections: [
      {
        title: "Voice Input Mastery",
        content: `Voice input is available throughout FamilyHub for hands-free operation.`,
        steps: [
          {
            number: 1,
            title: "Where to Find It",
            description: "Look for the microphone icon next to text fields on:\n• Event creation (title, description, location)\n• Task creation (title, description)\n• Grocery items (name, notes)\n• Meal plans (meal name, ingredients)\n• Notes (content)\n• Quick add boxes"
          },
          {
            number: 2,
            title: "How to Use",
            description: "1. Click the microphone icon\n2. Speak clearly (but naturally)\n3. Your speech is converted to text automatically\n4. Click the icon again to stop, or it stops automatically after a pause"
          },
          {
            number: 3,
            title: "Best Practices",
            description: "• Speak in a quiet environment for best accuracy\n• Use natural phrases, not keywords\n• Pause briefly between items when adding multiple things\n• Review text after speaking - you can edit if needed"
          },
          {
            number: 4,
            title: "Troubleshooting",
            description: "If voice input isn't working:\n• Check browser permissions (click the lock icon in address bar)\n• Make sure your microphone is connected\n• Try Chrome, Edge, or Safari (best support)\n• Check that your mic isn't muted systemwide"
          }
        ],
        tips: [
          "Voice input works great while cooking - add ingredients hands-free",
          "Use it while driving (safely) to add reminders",
          "Much faster than typing on mobile devices"
        ]
      },
      {
        title: "Household Management",
        content: `Advanced household administration and multi-household features.`,
        steps: [
          {
            number: 1,
            title: "Multiple Households",
            description: "You can belong to unlimited households. Perfect for:\n• Blended families (Mom's house, Dad's house)\n• Extended family coordination\n• Roommate situations\n• Caring for elderly parents"
          },
          {
            number: 2,
            title: "Switching Households",
            description: "Your 'active' household determines what you see on the Dashboard. Switch between households using the 'Switch to This' button on each household card."
          },
          {
            number: 3,
            title: "Admin vs Member",
            description: "Admin: Can edit household name, manage members, regenerate invite codes\nMember: Can view household, add content, but not manage settings"
          },
          {
            number: 4,
            title: "Leaving a Household",
            description: "Members can leave anytime. Admins must transfer admin rights before leaving, or delete the household entirely."
          }
        ]
      },
      {
        title: "Privacy & Visibility",
        content: `Control who sees what with granular privacy settings.`,
        steps: [
          {
            number: 1,
            title: "Three Visibility Levels",
            description: "My Household Only: Only members of your current active household\nAll My Households: Visible across all households you belong to\nPrivate (Just Me): Only you can see it"
          },
          {
            number: 2,
            title: "When to Use Each",
            description: "Household Only: Most family events, shared tasks, grocery lists\nAll Households: Things that affect multiple households (shared custody schedules)\nPrivate: Personal appointments, private reminders, sensitive information"
          },
          {
            number: 3,
            title: "Changing Visibility",
            description: "Edit any item and change its visibility setting. Takes effect immediately."
          }
        ]
      },
      {
        title: "Display Colors & Personalization",
        content: `Make the app your own.`,
        steps: [
          {
            number: 1,
            title: "Choose Your Color",
            description: "Go to Settings and pick from 8 colors. This color appears on:\n• All events you create\n• All tasks you create\n• Your profile badge\n• Anywhere your name appears"
          },
          {
            number: 2,
            title: "Family Color Coordination",
            description: "Have each family member choose a different color. At a glance, you'll know who created what!"
          }
        ]
      },
      {
        title: "Notifications & Reminders",
        content: `Stay on top of family activities.`,
        steps: [
          {
            number: 1,
            title: "Notification Preferences",
            description: "Go to Settings to toggle:\n• Email reminders for upcoming events\n• Event notifications\n• Task notifications"
          },
          {
            number: 2,
            title: "What You'll Be Notified About",
            description: "• Tasks assigned to you\n• Events on your calendar (reminders)\n• When someone adds you to a household\n• Important updates"
          }
        ]
      },
      {
        title: "Family Photos & Memories",
        content: `Share and preserve family moments.`,
        steps: [
          {
            number: 1,
            title: "Upload Photos",
            description: "Go to Family Photos and click 'Upload Photo'. Choose one or multiple images."
          },
          {
            number: 2,
            title: "Add Context",
            description: "Add captions and dates to preserve memories. Great for vacation photos, holidays, and milestones."
          },
          {
            number: 3,
            title: "Shared Gallery",
            description: "All household members can view and add to the shared photo gallery."
          }
        ]
      },
      {
        title: "Notes & Information",
        content: `Store important family information.`,
        steps: [
          {
            number: 1,
            title: "Create Notes",
            description: "Go to Family Notes to store:\n• Emergency contacts\n• WiFi passwords\n• School schedules\n• Medical information\n• Instructions for pet sitters\n• Recipes\n• Anything important!"
          },
          {
            number: 2,
            title: "Pin Important Notes",
            description: "Click the pin icon to keep critical notes at the top."
          },
          {
            number: 3,
            title: "Organize by Category",
            description: "Use categories to group related notes together."
          }
        ]
      },
      {
        title: "Data Security",
        content: `Your family's privacy matters.`,
        steps: [
          {
            number: 1,
            title: "Who Can See Your Data",
            description: "Only authenticated household members can access your shared data. Private items are encrypted and only visible to you."
          },
          {
            number: 2,
            title: "Invite Code Security",
            description: "Guard your invite code like a password. Anyone with the code can join your household."
          },
          {
            number: 3,
            title: "Best Practices",
            description: "• Use strong passwords for your account\n• Don't share invite codes publicly\n• Review household members periodically\n• Remove members who shouldn't have access"
          }
        ]
      }
    ]
  }
};

export default function UserGuideRenderer({ guide }) {
  const guideData = UserGuides[guide];

  if (!guideData) return null;

  return (
    <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-4">
      {/* Header */}
      <div className="flex items-center gap-4 sticky top-0 bg-white pb-4 border-b z-10">
        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white">
          {guideData.icon}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{guideData.title}</h2>
          <p className="text-sm text-gray-600">Complete guide to mastering this feature</p>
        </div>
      </div>

      {/* Sections */}
      {guideData.sections.map((section, idx) => (
        <div key={idx} className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-sm">
              {idx + 1}
            </div>
            {section.title}
          </h3>
          
          {section.content && (
            <p className="text-gray-700 leading-relaxed pl-10">{section.content}</p>
          )}

          {section.steps && section.steps.length > 0 && (
            <div className="space-y-4 pl-10">
              {section.steps.map((step, stepIdx) => (
                <Card key={stepIdx} className="bg-gradient-to-br from-orange-50 to-pink-50 border-l-4 border-orange-500">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {step.number && (
                        <div className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                          {step.number}
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
                        <p className="text-gray-700 text-sm whitespace-pre-line">{step.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {section.tips && section.tips.length > 0 && (
            <div className="pl-10 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Pro Tips
              </h4>
              <ul className="space-y-2">
                {section.tips.map((tip, tipIdx) => (
                  <li key={tipIdx} className="text-blue-800 text-sm flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}

      {/* Footer */}
      <div className="sticky bottom-0 bg-gradient-to-r from-orange-100 to-pink-100 p-6 rounded-lg border-2 border-orange-200">
        <h4 className="font-semibold text-gray-900 mb-2">Need More Help?</h4>
        <p className="text-gray-700 text-sm mb-3">
          Can't find what you're looking for? Our AI assistant is here to answer any questions!
        </p>
        <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
          <MessageCircle className="w-4 h-4 mr-2" />
          Ask AI Assistant
        </Button>
      </div>
    </div>
  );
}
