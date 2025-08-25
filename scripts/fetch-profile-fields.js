import fetch from "node-fetch"

async function fetchProfileFields() {
  try {
    console.log("Fetching Restaurant Profile Fields CSV...")
    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Restaurant_Profile_Setup_Fields-Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8.csv",
    )
    const csvText = await response.text()

    console.log("Raw CSV content (first 500 chars):")
    console.log(csvText.substring(0, 500) + "...\n")

    // Parse CSV
    const lines = csvText.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, "").trim())

    console.log("Headers:", headers)
    console.log("Total rows:", lines.length - 1)

    const fields = []
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.replace(/"/g, "").trim())
      const field = {}
      headers.forEach((header, index) => {
        field[header] = values[index] || ""
      })
      fields.push(field)
    }

    // Group by section
    const sections = {}
    fields.forEach((field) => {
      const section = field.Section || "Other"
      if (!sections[section]) {
        sections[section] = []
      }
      sections[section].push(field)
    })

    console.log("\n=== RESTAURANT PROFILE SECTIONS ===")
    Object.keys(sections).forEach((sectionName) => {
      console.log(`\n${sectionName.toUpperCase()}:`)
      sections[sectionName].forEach((field) => {
        console.log(`  - ${field.Field} (${field["Field Type"]}) - ${field["Input Type"]}`)
        if (field.Notes) {
          console.log(`    Notes: ${field.Notes}`)
        }
      })
    })

    // Analyze field types
    const fieldTypes = {}
    const inputTypes = {}

    fields.forEach((field) => {
      const fieldType = field["Field Type"] || "Unknown"
      const inputType = field["Input Type"] || "Unknown"

      fieldTypes[fieldType] = (fieldTypes[fieldType] || 0) + 1
      inputTypes[inputType] = (inputTypes[inputType] || 0) + 1
    })

    console.log("\n=== FIELD TYPE ANALYSIS ===")
    console.log("Field Types:")
    Object.entries(fieldTypes).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} fields`)
    })

    console.log("\nInput Types:")
    Object.entries(inputTypes).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} fields`)
    })

    // Generate form structure for implementation
    console.log("\n=== FORM STRUCTURE FOR IMPLEMENTATION ===")
    Object.keys(sections).forEach((sectionName) => {
      console.log(`\n${sectionName}:`)
      sections[sectionName].forEach((field) => {
        const required = field["Shown in Setup Form"] === "Required" ? "required" : "optional"
        console.log(`  ${field.Field}: ${field["Field Type"]} (${required})`)
      })
    })

    return { sections, fields, fieldTypes, inputTypes }
  } catch (error) {
    console.error("Error fetching profile fields:", error)
  }
}

// Execute the analysis
fetchProfileFields()
