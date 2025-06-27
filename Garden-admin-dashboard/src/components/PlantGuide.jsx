"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Calendar, Sun, Leaf } from "lucide-react"
import PlantCard from "./PlantCard"
import PlantDetails from "./PlantDetails"
import PlantingCalendar from "./PlantingCalendar"
import CareGuide from "./CareGuide"

const PlantGuide = () => {
  const [plants, setPlants] = useState([])
  const [filteredPlants, setFilteredPlants] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [seasonFilter, setSeasonFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [activeView, setActiveView] = useState("catalog") // catalog, calendar, care
  const [selectedPlant, setSelectedPlant] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  // Initialize dummy plant data
  useEffect(() => {
    const dummyPlants = [
      {
        id: 1,
        name: "Tomato",
        scientificName: "Solanum lycopersicum",
        category: "vegetables",
        variety: "Cherry Tomato",
        image: "/placeholder.svg?height=200&width=200",
        description: "Sweet, bite-sized tomatoes perfect for salads and snacking. Easy to grow and very productive.",
        difficulty: "beginner",
        sunRequirement: "full_sun",
        waterNeeds: "moderate",
        spacing: "18-24 inches",
        height: "4-6 feet",
        daysToMaturity: 65,
        plantingSeasons: ["spring", "early_summer"],
        harvestTime: ["summer", "fall"],
        soilType: ["loamy", "sandy"],
        phRange: { min: 6.0, max: 6.8 },
        temperature: { min: 60, max: 85 },
        companionPlants: ["Basil", "Marigold", "Pepper"],
        avoidPlants: ["Fennel", "Walnut"],
        careInstructions: {
          watering: "Water deeply 1-2 times per week. Keep soil consistently moist but not waterlogged.",
          fertilizing: "Feed with balanced fertilizer every 2-3 weeks during growing season.",
          pruning: "Remove suckers and lower leaves. Support with stakes or cages.",
          pests: ["Hornworms", "Aphids", "Whiteflies"],
          diseases: ["Blight", "Fusarium Wilt", "Mosaic Virus"],
        },
        nutritionalInfo: {
          vitamins: ["Vitamin C", "Vitamin K", "Folate"],
          minerals: ["Potassium", "Manganese"],
          calories: "18 per 100g",
        },
        tips: [
          "Mulch around plants to retain moisture and prevent weeds",
          "Harvest when fruits are fully colored but still firm",
          "Regular harvesting encourages more fruit production",
        ],
      },
      {
        id: 2,
        name: "Lettuce",
        scientificName: "Lactuca sativa",
        category: "vegetables",
        variety: "Butterhead",
        image: "/placeholder.svg?height=200&width=200",
        description: "Tender, sweet lettuce with soft, buttery leaves. Perfect for fresh salads and sandwiches.",
        difficulty: "beginner",
        sunRequirement: "partial_shade",
        waterNeeds: "high",
        spacing: "6-8 inches",
        height: "6-8 inches",
        daysToMaturity: 45,
        plantingSeasons: ["spring", "fall"],
        harvestTime: ["spring", "fall", "winter"],
        soilType: ["loamy", "clay"],
        phRange: { min: 6.0, max: 7.0 },
        temperature: { min: 45, max: 75 },
        companionPlants: ["Carrots", "Radishes", "Chives"],
        avoidPlants: ["Celery"],
        careInstructions: {
          watering: "Keep soil consistently moist. Water daily in hot weather.",
          fertilizing: "Light feeding with nitrogen-rich fertilizer every 2 weeks.",
          pruning: "Harvest outer leaves regularly to encourage new growth.",
          pests: ["Aphids", "Slugs", "Cutworms"],
          diseases: ["Downy Mildew", "Lettuce Drop"],
        },
        nutritionalInfo: {
          vitamins: ["Vitamin A", "Vitamin K", "Folate"],
          minerals: ["Iron", "Potassium"],
          calories: "15 per 100g",
        },
        tips: [
          "Plant in succession every 2 weeks for continuous harvest",
          "Provide shade during hot summer months",
          "Harvest in the morning when leaves are crisp",
        ],
      },
      {
        id: 3,
        name: "Basil",
        scientificName: "Ocimum basilicum",
        category: "herbs",
        variety: "Sweet Basil",
        image: "/placeholder.svg?height=200&width=200",
        description: "Aromatic herb with sweet, peppery flavor. Essential for Italian cooking and pest control.",
        difficulty: "beginner",
        sunRequirement: "full_sun",
        waterNeeds: "moderate",
        spacing: "12-18 inches",
        height: "12-24 inches",
        daysToMaturity: 60,
        plantingSeasons: ["spring", "early_summer"],
        harvestTime: ["summer", "fall"],
        soilType: ["loamy", "sandy"],
        phRange: { min: 6.0, max: 7.5 },
        temperature: { min: 65, max: 85 },
        companionPlants: ["Tomato", "Pepper", "Oregano"],
        avoidPlants: ["Rue"],
        careInstructions: {
          watering: "Water when top inch of soil is dry. Avoid overhead watering.",
          fertilizing: "Light feeding monthly with balanced fertilizer.",
          pruning: "Pinch flowers to encourage leaf growth. Harvest regularly.",
          pests: ["Aphids", "Japanese Beetles"],
          diseases: ["Fusarium Wilt", "Bacterial Leaf Spot"],
        },
        nutritionalInfo: {
          vitamins: ["Vitamin K", "Vitamin A"],
          minerals: ["Manganese", "Iron"],
          calories: "22 per 100g",
        },
        tips: [
          "Pinch flower buds to keep leaves tender",
          "Harvest in the morning after dew dries",
          "Can be grown indoors in winter",
        ],
      },
      {
        id: 4,
        name: "Marigold",
        scientificName: "Tagetes patula",
        category: "flowers",
        variety: "French Marigold",
        image: "/placeholder.svg?height=200&width=200",
        description:
          "Bright, cheerful flowers that repel pests and attract beneficial insects. Perfect companion plant.",
        difficulty: "beginner",
        sunRequirement: "full_sun",
        waterNeeds: "low",
        spacing: "6-12 inches",
        height: "6-12 inches",
        daysToMaturity: 50,
        plantingSeasons: ["spring", "early_summer"],
        harvestTime: ["summer", "fall"],
        soilType: ["loamy", "sandy", "clay"],
        phRange: { min: 6.0, max: 7.5 },
        temperature: { min: 60, max: 85 },
        companionPlants: ["Tomato", "Pepper", "Cucumber"],
        avoidPlants: [],
        careInstructions: {
          watering: "Water moderately. Allow soil to dry between waterings.",
          fertilizing: "Low fertility needs. Over-fertilizing reduces flowering.",
          pruning: "Deadhead spent flowers to encourage more blooms.",
          pests: ["Spider Mites", "Aphids"],
          diseases: ["Powdery Mildew", "Root Rot"],
        },
        nutritionalInfo: {
          vitamins: [],
          minerals: [],
          calories: "Not applicable",
        },
        tips: [
          "Plant around vegetable gardens to deter pests",
          "Flowers are edible and add color to salads",
          "Self-seeds readily for next year's garden",
        ],
      },
      {
        id: 5,
        name: "Carrot",
        scientificName: "Daucus carota",
        category: "vegetables",
        variety: "Nantes",
        image: "/placeholder.svg?height=200&width=200",
        description:
          "Sweet, crisp root vegetable with excellent storage qualities. Great for fresh eating and cooking.",
        difficulty: "intermediate",
        sunRequirement: "full_sun",
        waterNeeds: "moderate",
        spacing: "2-3 inches",
        height: "8-10 inches",
        daysToMaturity: 70,
        plantingSeasons: ["spring", "fall"],
        harvestTime: ["summer", "fall", "winter"],
        soilType: ["sandy", "loamy"],
        phRange: { min: 6.0, max: 6.8 },
        temperature: { min: 55, max: 75 },
        companionPlants: ["Lettuce", "Chives", "Rosemary"],
        avoidPlants: ["Dill"],
        careInstructions: {
          watering: "Keep soil consistently moist but not waterlogged.",
          fertilizing: "Avoid high-nitrogen fertilizers. Use phosphorus-rich fertilizer.",
          pruning: "Thin seedlings to proper spacing when 2 inches tall.",
          pests: ["Carrot Fly", "Wireworms"],
          diseases: ["Leaf Blight", "Root Rot"],
        },
        nutritionalInfo: {
          vitamins: ["Vitamin A", "Vitamin K", "Vitamin C"],
          minerals: ["Potassium", "Fiber"],
          calories: "41 per 100g",
        },
        tips: [
          "Sow seeds directly in garden - don't transplant",
          "Loose, deep soil is essential for straight roots",
          "Can be left in ground and harvested as needed",
        ],
      },
      {
        id: 6,
        name: "Sunflower",
        scientificName: "Helianthus annuus",
        category: "flowers",
        variety: "Mammoth",
        image: "/placeholder.svg?height=200&width=200",
        description: "Giant, cheerful flowers that follow the sun. Produces edible seeds and attracts pollinators.",
        difficulty: "beginner",
        sunRequirement: "full_sun",
        waterNeeds: "moderate",
        spacing: "12-18 inches",
        height: "6-12 feet",
        daysToMaturity: 80,
        plantingSeasons: ["spring", "early_summer"],
        harvestTime: ["fall"],
        soilType: ["loamy", "sandy"],
        phRange: { min: 6.0, max: 7.5 },
        temperature: { min: 65, max: 85 },
        companionPlants: ["Corn", "Cucumber", "Beans"],
        avoidPlants: ["Potato"],
        careInstructions: {
          watering: "Deep watering once or twice per week.",
          fertilizing: "Feed with balanced fertilizer monthly.",
          pruning: "Support tall varieties with stakes.",
          pests: ["Birds", "Squirrels", "Aphids"],
          diseases: ["Rust", "Downy Mildew"],
        },
        nutritionalInfo: {
          vitamins: ["Vitamin E", "Vitamin B6"],
          minerals: ["Magnesium", "Selenium"],
          calories: "584 per 100g (seeds)",
        },
        tips: [
          "Plant after last frost when soil is warm",
          "Protect seed heads from birds with netting",
          "Harvest seeds when back of flower head turns brown",
        ],
      },
      {
        id: 7,
        name: "Pepper",
        scientificName: "Capsicum annuum",
        category: "vegetables",
        variety: "Bell Pepper",
        image: "/placeholder.svg?height=200&width=200",
        description: "Sweet, crunchy peppers in various colors. Excellent fresh, cooked, or preserved.",
        difficulty: "intermediate",
        sunRequirement: "full_sun",
        waterNeeds: "moderate",
        spacing: "18-24 inches",
        height: "18-36 inches",
        daysToMaturity: 75,
        plantingSeasons: ["spring"],
        harvestTime: ["summer", "fall"],
        soilType: ["loamy", "sandy"],
        phRange: { min: 6.0, max: 6.8 },
        temperature: { min: 65, max: 85 },
        companionPlants: ["Tomato", "Basil", "Onion"],
        avoidPlants: ["Fennel"],
        careInstructions: {
          watering: "Consistent moisture. Avoid overhead watering.",
          fertilizing: "Balanced fertilizer every 3-4 weeks.",
          pruning: "Support plants with stakes or cages.",
          pests: ["Aphids", "Hornworms", "Flea Beetles"],
          diseases: ["Bacterial Spot", "Mosaic Virus"],
        },
        nutritionalInfo: {
          vitamins: ["Vitamin C", "Vitamin A", "Vitamin B6"],
          minerals: ["Potassium", "Folate"],
          calories: "31 per 100g",
        },
        tips: [
          "Harvest when peppers reach full size but before fully ripe for best flavor",
          "Leave some peppers to fully ripen for seeds",
          "Mulch to maintain consistent soil moisture",
        ],
      },
      {
        id: 8,
        name: "Rosemary",
        scientificName: "Rosmarinus officinalis",
        category: "herbs",
        variety: "Common Rosemary",
        image: "/placeholder.svg?height=200&width=200",
        description:
          "Fragrant, evergreen herb with needle-like leaves. Excellent for cooking and natural pest control.",
        difficulty: "intermediate",
        sunRequirement: "full_sun",
        waterNeeds: "low",
        spacing: "24-36 inches",
        height: "24-48 inches",
        daysToMaturity: 90,
        plantingSeasons: ["spring", "fall"],
        harvestTime: ["year_round"],
        soilType: ["sandy", "loamy"],
        phRange: { min: 6.0, max: 7.5 },
        temperature: { min: 50, max: 85 },
        companionPlants: ["Carrot", "Bean", "Cabbage"],
        avoidPlants: [],
        careInstructions: {
          watering: "Water sparingly. Allow soil to dry between waterings.",
          fertilizing: "Low fertility needs. Fertilize lightly in spring.",
          pruning: "Prune after flowering to maintain shape.",
          pests: ["Spider Mites", "Aphids"],
          diseases: ["Root Rot", "Powdery Mildew"],
        },
        nutritionalInfo: {
          vitamins: ["Vitamin A", "Vitamin C"],
          minerals: ["Iron", "Calcium"],
          calories: "131 per 100g",
        },
        tips: [
          "Excellent drainage is essential",
          "Can be grown as a perennial in mild climates",
          "Harvest sprigs regularly to encourage growth",
        ],
      },
    ]

    setPlants(dummyPlants)
    setFilteredPlants(dummyPlants)
  }, [])

  // Filter plants
  useEffect(() => {
    let filtered = plants

    if (searchTerm) {
      filtered = filtered.filter(
        (plant) =>
          plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plant.scientificName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plant.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          plant.variety.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((plant) => plant.category === categoryFilter)
    }

    if (seasonFilter !== "all") {
      filtered = filtered.filter((plant) => plant.plantingSeasons.includes(seasonFilter))
    }

    if (difficultyFilter !== "all") {
      filtered = filtered.filter((plant) => plant.difficulty === difficultyFilter)
    }

    setFilteredPlants(filtered)
  }, [plants, searchTerm, categoryFilter, seasonFilter, difficultyFilter])

  const openPlantDetails = (plant) => {
    setSelectedPlant(plant)
    setShowDetails(true)
  }

  const getCurrentSeasonPlants = () => {
    const currentMonth = new Date().getMonth()
    let currentSeason = "spring"

    if (currentMonth >= 2 && currentMonth <= 4) currentSeason = "spring"
    else if (currentMonth >= 5 && currentMonth <= 7) currentSeason = "summer"
    else if (currentMonth >= 8 && currentMonth <= 10) currentSeason = "fall"
    else currentSeason = "winter"

    return plants.filter((plant) => plant.plantingSeasons.includes(currentSeason))
  }

  const getPlantsByCategory = () => {
    const categories = {}
    plants.forEach((plant) => {
      if (!categories[plant.category]) {
        categories[plant.category] = []
      }
      categories[plant.category].push(plant)
    })
    return categories
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plant Guide</h1>
          <p className="text-gray-600">Comprehensive guide to growing healthy plants in your garden</p>
        </div>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveView("catalog")}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              activeView === "catalog" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Plant Catalog
          </button>
          <button
            onClick={() => setActiveView("calendar")}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              activeView === "calendar" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Planting Calendar
          </button>
          <button
            onClick={() => setActiveView("care")}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              activeView === "care" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Care Guide
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Plants</p>
              <p className="text-2xl font-bold text-green-600">{plants.length}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Leaf className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Seasonal Plants</p>
              <p className="text-2xl font-bold text-blue-600">{getCurrentSeasonPlants().length}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Beginner Friendly</p>
              <p className="text-2xl font-bold text-yellow-600">
                {plants.filter((p) => p.difficulty === "beginner").length}
              </p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Sun className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-purple-600">{Object.keys(getPlantsByCategory()).length}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Filter className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Content based on active view */}
      {activeView === "catalog" && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search plants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="vegetables">Vegetables</option>
                <option value="herbs">Herbs</option>
                <option value="flowers">Flowers</option>
                <option value="fruits">Fruits</option>
              </select>

              <select
                value={seasonFilter}
                onChange={(e) => setSeasonFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Seasons</option>
                <option value="spring">Spring</option>
                <option value="summer">Summer</option>
                <option value="fall">Fall</option>
                <option value="winter">Winter</option>
              </select>

              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Difficulties</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>

              <button
                onClick={() => {
                  setSearchTerm("")
                  setCategoryFilter("all")
                  setSeasonFilter("all")
                  setDifficultyFilter("all")
                }}
                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Plant Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} onViewDetails={openPlantDetails} />
            ))}
          </div>

          {filteredPlants.length === 0 && (
            <div className="text-center py-12">
              <Leaf className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No plants found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
            </div>
          )}
        </>
      )}

      {activeView === "calendar" && <PlantingCalendar plants={plants} />}
      {activeView === "care" && <CareGuide plants={plants} />}

      {/* Plant Details Modal */}
      {showDetails && selectedPlant && (
        <PlantDetails
          plant={selectedPlant}
          onClose={() => {
            setShowDetails(false)
            setSelectedPlant(null)
          }}
        />
      )}
    </div>
  )
}

export default PlantGuide
