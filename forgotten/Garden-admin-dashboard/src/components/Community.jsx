"use client"

import { useState, useEffect } from "react"
import { Users, Calendar, MessageSquare, Award, Plus } from "lucide-react"
import MemberDirectory from "./MemberDirectory"
import CommunityEvents from "./CommunityEvents"
import CommunityForum from "./CommunityForum"
import Achievements from "./Achievements"
import EventForm from "./EventForm"

const Community = () => {
  const [activeView, setActiveView] = useState("members") // members, events, forum, achievements
  const [members, setMembers] = useState([])
  const [events, setEvents] = useState([])
  const [forumPosts, setForumPosts] = useState([])
  const [achievements, setAchievements] = useState([])
  const [showEventForm, setShowEventForm] = useState(false)

  // Initialize dummy data
  useEffect(() => {
    // Members data
    const dummyMembers = [
      {
        id: 1,
        name: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        phone: "(555) 123-4567",
        joinDate: "2023-03-15",
        role: "coordinator",
        status: "active",
        avatar: "/placeholder.svg?height=100&width=100",
        bio: "Passionate organic gardener with 10+ years of experience. Specializes in heirloom tomatoes and companion planting.",
        plots: ["P001", "P015"],
        specialties: ["Organic Gardening", "Composting", "Seed Saving"],
        contributions: 45,
        eventsAttended: 12,
        forumPosts: 28,
        achievements: ["Green Thumb", "Community Leader", "Master Gardener"],
        socialMedia: {
          instagram: "@sarahsgarden",
          facebook: "Sarah Johnson Gardening",
        },
        availability: ["weekends", "evenings"],
        languages: ["English", "Spanish"],
      },
      {
        id: 2,
        name: "Mike Davis",
        email: "mike.davis@email.com",
        phone: "(555) 234-5678",
        joinDate: "2023-01-20",
        role: "member",
        status: "active",
        avatar: "/placeholder.svg?height=100&width=100",
        bio: "Retired engineer turned gardener. Love building garden infrastructure and teaching kids about plants.",
        plots: ["P008"],
        specialties: ["Garden Infrastructure", "Tool Maintenance", "Youth Education"],
        contributions: 32,
        eventsAttended: 8,
        forumPosts: 15,
        achievements: ["Handy Helper", "Mentor"],
        socialMedia: {},
        availability: ["mornings", "weekdays"],
        languages: ["English"],
      },
      {
        id: 3,
        name: "Emily Brown",
        email: "emily.brown@email.com",
        phone: "(555) 345-6789",
        joinDate: "2023-05-10",
        role: "member",
        status: "active",
        avatar: "/placeholder.svg?height=100&width=100",
        bio: "Herbalist and natural medicine enthusiast. Growing medicinal plants and teaching about their uses.",
        plots: ["P012", "P013"],
        specialties: ["Medicinal Plants", "Herbal Medicine", "Natural Remedies"],
        contributions: 28,
        eventsAttended: 15,
        forumPosts: 22,
        achievements: ["Herbalist", "Knowledge Sharer"],
        socialMedia: {
          instagram: "@emilysherbgarden",
        },
        availability: ["weekends", "afternoons"],
        languages: ["English", "French"],
      },
      {
        id: 4,
        name: "David Wilson",
        email: "david.wilson@email.com",
        phone: "(555) 456-7890",
        joinDate: "2023-02-28",
        role: "treasurer",
        status: "active",
        avatar: "/placeholder.svg?height=100&width=100",
        bio: "Financial advisor by day, vegetable gardener by weekend. Managing community finances and budget planning.",
        plots: ["P005"],
        specialties: ["Financial Planning", "Budget Management", "Vegetable Gardening"],
        contributions: 38,
        eventsAttended: 10,
        forumPosts: 12,
        achievements: ["Financial Steward", "Reliable Member"],
        socialMedia: {},
        availability: ["weekends"],
        languages: ["English"],
      },
      {
        id: 5,
        name: "Lisa Garcia",
        email: "lisa.garcia@email.com",
        phone: "(555) 567-8901",
        joinDate: "2023-04-05",
        role: "member",
        status: "active",
        avatar: "/placeholder.svg?height=100&width=100",
        bio: "Chef and food enthusiast. Growing ingredients for farm-to-table cooking and organizing harvest dinners.",
        plots: ["P018", "P019"],
        specialties: ["Culinary Herbs", "Cooking", "Food Preservation"],
        contributions: 25,
        eventsAttended: 18,
        forumPosts: 35,
        achievements: ["Master Chef", "Event Organizer"],
        socialMedia: {
          instagram: "@lisascooksgarden",
          facebook: "Lisa's Garden Kitchen",
        },
        availability: ["evenings", "weekends"],
        languages: ["English", "Spanish"],
      },
      {
        id: 6,
        name: "Tom Anderson",
        email: "tom.anderson@email.com",
        phone: "(555) 678-9012",
        joinDate: "2023-06-12",
        role: "member",
        status: "active",
        avatar: "/placeholder.svg?height=100&width=100",
        bio: "Permaculture designer focused on sustainable gardening practices and water conservation.",
        plots: ["P022"],
        specialties: ["Permaculture", "Water Conservation", "Sustainable Design"],
        contributions: 20,
        eventsAttended: 6,
        forumPosts: 18,
        achievements: ["Eco Warrior", "Water Saver"],
        socialMedia: {},
        availability: ["weekends", "mornings"],
        languages: ["English"],
      },
      {
        id: 7,
        name: "Maria Rodriguez",
        email: "maria.rodriguez@email.com",
        phone: "(555) 789-0123",
        joinDate: "2023-07-20",
        role: "member",
        status: "active",
        avatar: "/placeholder.svg?height=100&width=100",
        bio: "Elementary school teacher bringing kids to learn about gardening and nature.",
        plots: ["P010"],
        specialties: ["Education", "Children's Programs", "Nature Activities"],
        contributions: 15,
        eventsAttended: 9,
        forumPosts: 8,
        achievements: ["Teacher", "Youth Mentor"],
        socialMedia: {
          facebook: "Maria's Nature Class",
        },
        availability: ["afternoons", "weekends"],
        languages: ["English", "Spanish"],
      },
      {
        id: 8,
        name: "James Taylor",
        email: "james.taylor@email.com",
        phone: "(555) 890-1234",
        joinDate: "2023-08-15",
        role: "member",
        status: "inactive",
        avatar: "/placeholder.svg?height=100&width=100",
        bio: "Bee keeper and pollinator advocate. Maintaining hives and educating about bee conservation.",
        plots: [],
        specialties: ["Beekeeping", "Pollinator Plants", "Honey Production"],
        contributions: 8,
        eventsAttended: 3,
        forumPosts: 5,
        achievements: ["Bee Keeper"],
        socialMedia: {},
        availability: ["weekends"],
        languages: ["English"],
      },
    ]

    // Events data
    const dummyEvents = [
      {
        id: 1,
        title: "Spring Planting Workshop",
        description:
          "Learn the best practices for starting your spring garden. We'll cover soil preparation, seed starting, and companion planting techniques.",
        date: "2024-03-20",
        time: "10:00",
        duration: 180,
        location: "Community Garden - Main Pavilion",
        organizer: "Sarah Johnson",
        category: "workshop",
        maxAttendees: 25,
        currentAttendees: 18,
        status: "upcoming",
        image: "/placeholder.svg?height=200&width=300",
        materials: ["Seeds", "Small pots", "Soil", "Labels"],
        prerequisites: "None - beginner friendly",
        cost: 0,
        attendees: [
          { id: 1, name: "Sarah Johnson", status: "confirmed" },
          { id: 2, name: "Mike Davis", status: "confirmed" },
          { id: 3, name: "Emily Brown", status: "confirmed" },
          { id: 4, name: "David Wilson", status: "maybe" },
          { id: 5, name: "Lisa Garcia", status: "confirmed" },
        ],
        tags: ["beginner", "spring", "planting", "workshop"],
      },
      {
        id: 2,
        title: "Community Harvest Festival",
        description:
          "Celebrate the season's bounty with a community harvest festival. Bring dishes made from garden produce to share!",
        date: "2024-03-25",
        time: "16:00",
        duration: 240,
        location: "Community Garden - Central Area",
        organizer: "Lisa Garcia",
        category: "social",
        maxAttendees: 50,
        currentAttendees: 32,
        status: "upcoming",
        image: "/placeholder.svg?height=200&width=300",
        materials: ["Potluck dish", "Serving utensils", "Appetite"],
        prerequisites: "None",
        cost: 0,
        attendees: [],
        tags: ["social", "harvest", "potluck", "community"],
      },
      {
        id: 3,
        title: "Composting 101",
        description:
          "Master the art of composting! Learn about different composting methods, what to compost, and troubleshooting common issues.",
        date: "2024-04-05",
        time: "14:00",
        duration: 120,
        location: "Community Garden - Compost Area",
        organizer: "Sarah Johnson",
        category: "workshop",
        maxAttendees: 15,
        currentAttendees: 12,
        status: "upcoming",
        image: "/placeholder.svg?height=200&width=300",
        materials: ["Notebook", "Gloves"],
        prerequisites: "None",
        cost: 5,
        attendees: [],
        tags: ["composting", "sustainability", "workshop", "environment"],
      },
      {
        id: 4,
        title: "Kids Garden Adventure",
        description:
          "Fun gardening activities for children ages 5-12. Plant seeds, learn about insects, and explore the garden!",
        date: "2024-04-12",
        time: "10:00",
        duration: 90,
        location: "Community Garden - Children's Area",
        organizer: "Maria Rodriguez",
        category: "education",
        maxAttendees: 20,
        currentAttendees: 8,
        status: "upcoming",
        image: "/placeholder.svg?height=200&width=300",
        materials: ["Provided by organizer"],
        prerequisites: "Ages 5-12, parent supervision required",
        cost: 0,
        attendees: [],
        tags: ["kids", "education", "family", "fun"],
      },
      {
        id: 5,
        title: "Medicinal Plants Workshop",
        description:
          "Discover the healing power of plants! Learn to identify, grow, and use common medicinal plants safely.",
        date: "2024-04-18",
        time: "13:00",
        duration: 150,
        location: "Community Garden - Herb Section",
        organizer: "Emily Brown",
        category: "workshop",
        maxAttendees: 12,
        currentAttendees: 9,
        status: "upcoming",
        image: "/placeholder.svg?height=200&width=300",
        materials: ["Notebook", "Small containers for samples"],
        prerequisites: "Basic plant knowledge helpful",
        cost: 10,
        attendees: [],
        tags: ["medicinal", "herbs", "health", "workshop"],
      },
      {
        id: 6,
        title: "Winter Garden Cleanup",
        description:
          "Join us for our annual winter garden cleanup. Help prepare beds for spring and maintain common areas.",
        date: "2024-02-15",
        time: "09:00",
        duration: 300,
        location: "Community Garden - All Areas",
        organizer: "Mike Davis",
        category: "maintenance",
        maxAttendees: 30,
        currentAttendees: 22,
        status: "completed",
        image: "/placeholder.svg?height=200&width=300",
        materials: ["Work gloves", "Pruning shears", "Rake"],
        prerequisites: "None",
        cost: 0,
        attendees: [],
        tags: ["maintenance", "cleanup", "community", "volunteer"],
      },
    ]

    // Forum posts data
    const dummyForumPosts = [
      {
        id: 1,
        title: "Best tomato varieties for our climate?",
        content:
          "I'm planning my tomato garden for this year and wondering what varieties have worked best for everyone here. Last year my Cherokee Purples did amazing, but the Early Girls struggled. What are your favorites?",
        author: "Sarah Johnson",
        authorId: 1,
        category: "plant_advice",
        createdAt: "2024-03-10T14:30:00Z",
        updatedAt: "2024-03-10T14:30:00Z",
        likes: 8,
        replies: 12,
        tags: ["tomatoes", "varieties", "climate", "advice"],
        isPinned: false,
        isResolved: false,
        lastReply: "2024-03-12T09:15:00Z",
        replyCount: 12,
        viewCount: 45,
      },
      {
        id: 2,
        title: "Aphid invasion - need help!",
        content:
          "My pepper plants are covered in aphids! I've tried spraying them off with water but they keep coming back. Any organic solutions that have worked for you?",
        author: "Mike Davis",
        authorId: 2,
        category: "pest_control",
        createdAt: "2024-03-08T16:45:00Z",
        updatedAt: "2024-03-08T16:45:00Z",
        likes: 5,
        replies: 8,
        tags: ["aphids", "pests", "organic", "peppers", "help"],
        isPinned: false,
        isResolved: true,
        lastReply: "2024-03-09T11:20:00Z",
        replyCount: 8,
        viewCount: 32,
      },
      {
        id: 3,
        title: "Community Tool Sharing Program",
        content:
          "I'd like to propose a tool sharing program where we can borrow and lend garden tools to each other. I have several tools I rarely use that others might need. Thoughts?",
        author: "David Wilson",
        authorId: 4,
        category: "community",
        createdAt: "2024-03-05T10:20:00Z",
        updatedAt: "2024-03-05T10:20:00Z",
        likes: 15,
        replies: 18,
        tags: ["tools", "sharing", "community", "proposal"],
        isPinned: true,
        isResolved: false,
        lastReply: "2024-03-11T15:30:00Z",
        replyCount: 18,
        viewCount: 78,
      },
      {
        id: 4,
        title: "Herb drying techniques",
        content:
          "What's the best way to dry herbs for winter storage? I have tons of basil, oregano, and thyme that I want to preserve. Air drying vs dehydrator vs oven?",
        author: "Emily Brown",
        authorId: 3,
        category: "preservation",
        createdAt: "2024-03-03T13:15:00Z",
        updatedAt: "2024-03-03T13:15:00Z",
        likes: 6,
        replies: 9,
        tags: ["herbs", "drying", "preservation", "storage"],
        isPinned: false,
        isResolved: false,
        lastReply: "2024-03-07T14:45:00Z",
        replyCount: 9,
        viewCount: 28,
      },
      {
        id: 5,
        title: "Successful companion planting combinations",
        content:
          "Let's share our successful companion planting combinations! I've had great success with tomatoes and basil, and carrots with chives. What works for you?",
        author: "Lisa Garcia",
        authorId: 5,
        category: "plant_advice",
        createdAt: "2024-03-01T11:00:00Z",
        updatedAt: "2024-03-01T11:00:00Z",
        likes: 12,
        replies: 15,
        tags: ["companion_planting", "combinations", "success", "tips"],
        isPinned: false,
        isResolved: false,
        lastReply: "2024-03-10T16:20:00Z",
        replyCount: 15,
        viewCount: 56,
      },
      {
        id: 6,
        title: "Water conservation tips",
        content:
          "With water restrictions coming this summer, let's share water conservation techniques. I've been experimenting with ollas (buried clay pots) and they're working great!",
        author: "Tom Anderson",
        authorId: 6,
        category: "sustainability",
        createdAt: "2024-02-28T09:30:00Z",
        updatedAt: "2024-02-28T09:30:00Z",
        likes: 10,
        replies: 11,
        tags: ["water", "conservation", "sustainability", "drought"],
        isPinned: false,
        isResolved: false,
        lastReply: "2024-03-08T12:10:00Z",
        replyCount: 11,
        viewCount: 41,
      },
    ]

    // Achievements data
    const dummyAchievements = [
      {
        id: 1,
        name: "Green Thumb",
        description: "Successfully grow 5 different plant varieties",
        icon: "🌱",
        category: "gardening",
        difficulty: "beginner",
        points: 100,
        requirements: ["Grow 5 different plants", "Document growth progress", "Harvest successfully"],
        unlockedBy: [1, 3, 5],
        totalEarned: 3,
      },
      {
        id: 2,
        name: "Community Leader",
        description: "Organize 3 community events",
        icon: "👑",
        category: "leadership",
        difficulty: "intermediate",
        points: 250,
        requirements: ["Organize 3 events", "Minimum 10 attendees each", "Positive feedback"],
        unlockedBy: [1],
        totalEarned: 1,
      },
      {
        id: 3,
        name: "Master Gardener",
        description: "Achieve expert level in multiple gardening areas",
        icon: "🏆",
        category: "expertise",
        difficulty: "advanced",
        points: 500,
        requirements: ["5+ years experience", "Mentor 3+ members", "Lead workshops"],
        unlockedBy: [1],
        totalEarned: 1,
      },
      {
        id: 4,
        name: "Handy Helper",
        description: "Complete 10 maintenance tasks",
        icon: "🔧",
        category: "maintenance",
        difficulty: "beginner",
        points: 150,
        requirements: ["Complete 10 maintenance tasks", "Help with infrastructure", "Tool maintenance"],
        unlockedBy: [2],
        totalEarned: 1,
      },
      {
        id: 5,
        name: "Knowledge Sharer",
        description: "Make 25 helpful forum posts",
        icon: "📚",
        category: "community",
        difficulty: "intermediate",
        points: 200,
        requirements: ["25+ forum posts", "Helpful responses", "Share expertise"],
        unlockedBy: [3, 5],
        totalEarned: 2,
      },
      {
        id: 6,
        name: "Eco Warrior",
        description: "Implement 5 sustainable practices",
        icon: "🌍",
        category: "sustainability",
        difficulty: "intermediate",
        points: 300,
        requirements: ["Composting", "Water conservation", "Organic methods", "Waste reduction", "Education"],
        unlockedBy: [6],
        totalEarned: 1,
      },
      {
        id: 7,
        name: "Mentor",
        description: "Successfully mentor 3 new gardeners",
        icon: "🎓",
        category: "education",
        difficulty: "intermediate",
        points: 250,
        requirements: ["Mentor 3+ new members", "Provide ongoing support", "Positive feedback"],
        unlockedBy: [2, 7],
        totalEarned: 2,
      },
      {
        id: 8,
        name: "Event Organizer",
        description: "Successfully organize a major community event",
        icon: "🎉",
        category: "leadership",
        difficulty: "intermediate",
        points: 200,
        requirements: ["Organize major event", "50+ attendees", "Successful execution"],
        unlockedBy: [5],
        totalEarned: 1,
      },
    ]

    setMembers(dummyMembers)
    setEvents(dummyEvents)
    setForumPosts(dummyForumPosts)
    setAchievements(dummyAchievements)
  }, [])

  const handleCreateEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: Math.max(...events.map((e) => e.id)) + 1,
      currentAttendees: 1,
      status: "upcoming",
      attendees: [],
    }
    setEvents([...events, newEvent])
    setShowEventForm(false)
  }

  const getActiveMembers = () => members.filter((member) => member.status === "active")
  const getUpcomingEvents = () => events.filter((event) => event.status === "upcoming")
  const getRecentPosts = () => forumPosts.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Community Hub</h1>
          <p className="text-gray-600">Connect, learn, and grow together with fellow gardeners</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveView("members")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                activeView === "members" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Members
            </button>
            <button
              onClick={() => setActiveView("events")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                activeView === "events" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Events
            </button>
            <button
              onClick={() => setActiveView("forum")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                activeView === "forum" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Forum
            </button>
            <button
              onClick={() => setActiveView("achievements")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                activeView === "achievements" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Achievements
            </button>
          </div>
          {activeView === "events" && (
            <button
              onClick={() => setShowEventForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Event</span>
            </button>
          )}
        </div>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Members</p>
              <p className="text-2xl font-bold text-green-600">{getActiveMembers().length}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
              <p className="text-2xl font-bold text-blue-600">{getUpcomingEvents().length}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Forum Posts</p>
              <p className="text-2xl font-bold text-purple-600">{forumPosts.length}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Achievements</p>
              <p className="text-2xl font-bold text-orange-600">{achievements.length}</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Award className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Content based on active view */}
      {activeView === "members" && <MemberDirectory members={members} />}
      {activeView === "events" && <CommunityEvents events={events} />}
      {activeView === "forum" && <CommunityForum forumPosts={forumPosts} />}
      {activeView === "achievements" && <Achievements achievements={achievements} members={members} />}

      {/* Event Form Modal */}
      {showEventForm && <EventForm onSubmit={handleCreateEvent} onClose={() => setShowEventForm(false)} />}
    </div>
  )
}

export default Community
