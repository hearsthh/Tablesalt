// Fetch and analyze the Menu Setup Fields CSV
async function analyzeMenuFields() {
  try {
    console.log("Fetching Menu Setup Fields CSV...")

    const response = await fetch(
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Menu_Setup_Fields-EXAVA7vwBJIxovK3C7TotgXGnegPOT.csv",
    )
    const csvText = await response.text()

    console.log("CSV Content Preview:")
    console.log(csvText.substring(0, 500) + "...")

    // Parse CSV
    const lines = csvText.split("\n")
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

    console.log("\nHeaders:", headers)

    const fields = []
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))
        const field = {}
        headers.forEach((header, index) => {
          field[header] = values[index] || ""
        })
        fields.push(field)
      }
    }

    console.log(`\nParsed ${fields.length} fields`)

    // Group by section
    const sections = {}
    fields.forEach((field) => {
      const section = field.Section || "Other"
      if (!sections[section]) {
        sections[section] = []
      }
      sections[section].push(field)
    })

    console.log("\nSections found:")
    Object.keys(sections).forEach((section) => {
      console.log(`- ${section}: ${sections[section].length} fields`)
    })

    // Detailed analysis
    console.log("\nDetailed Field Analysis:")
    Object.entries(sections).forEach(([sectionName, sectionFields]) => {
      console.log(`\n=== ${sectionName} ===`)
      sectionFields.forEach((field) => {
        console.log(`Field: ${field.Field}`)
        console.log(`  Type: ${field["Field Type"]}`)
        console.log(`  Input: ${field["Input Type"]}`)
        console.log(`  Required: ${field["Shown in Setup Form"]}`)
        console.log(`  Notes: ${field.Notes}`)
        console.log("---")
      })
    })

    return { fields, sections }
  } catch (error) {
    console.error("Error analyzing menu fields:", error)
  }
}

// Run the analysis
analyzeMenuFields()
