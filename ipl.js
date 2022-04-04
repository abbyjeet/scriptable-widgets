var PARAM_WIDGET_TITLE = "IPL Points Table"
var PARAM_LINK = "https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/feeds/stats/60-groupstandings.js"
var PARAM_BG_IMAGE_NAME = "none"
var PARAM_BG_IMAGE_BLUR = "true"
var PARAM_BG_IMAGE_GRADIENT = "true"
var PARAM_SHOW_NEWS_IMAGES = "true"

// get data
var items = await loadItems()

function ongroupstandings(x){
    return x.points
}

async function loadItems(){
    let req = new Request(PARAM_LINK)
    let json = await req.loadString()
    let data = eval("(function(){ return " + json + "}())")
    return data    
}

if (config.runsInWidget) {
    let widget = await createWidget(items)
    Script.setWidget(widget)
// } else if (config.runsWithSiri){
//     let table = createTable(items)
//     await QuickLook.present(table)
} else {
    config.widgetFamily = "large"
    let table = createTable(items)
    await QuickLook.present(table)
}

Script.complete()

function createTable(items){
    const table = new UITable()

    switch (config.widgetFamily) {
        case "small": {
            let row = new UITableRow()
            nameCell = row.addText("Small Widget")
            table.addRow(row)
        }
        break
        case "medium": {
            let row = new UITableRow()
            nameCell = row.addText("Medium Widget")
            table.addRow(row)
        }
        break
        case "large": {
            let row = new UITableRow()
            row.isHeader = true
            row.cellSpacing = 2
            // row.height = 60
            // row.cellSpacing = 10

            imageCell = row.addText("")
            imageCell.widthWeight = 10
            imageCell.titleFont =  Font.semiboldSystemFont(14)
            
            nameCell = row.addText("Team")
            nameCell.widthWeight = 50
            nameCell.titleFont = Font.semiboldSystemFont(14)
            
            pointsCell = row.addText("Pts")
            pointsCell.widthWeight = 7
            pointsCell.titleFont = Font.semiboldSystemFont(14)  
            pointsCell.rightAligned()
            
            nrrCell = row.addText("NRR")
            nrrCell.widthWeight = 15
            nrrCell.titleFont = Font.semiboldSystemFont(14)  
            nrrCell.rightAligned()
            
            formCell = row.addText("  Form")
            formCell.widthWeight = 15
            formCell.titleFont = Font.semiboldSystemFont(14)  
            formCell.leftAligned()

            table.addRow(row)
            for (const item of items) {
                let row = new UITableRow()
                row.cellSpacing = 2
                // row.height = 60
                // row.cellSpacing = 10

                imageCell = row.addImageAtURL(item.TeamLogo)
                imageCell.widthWeight = 10
                imageCell.titleFont = Font.regularSystemFont(12)
         
                
                nameCell = row.addText(item.TeamName)
                nameCell.widthWeight = 50
                nameCell.titleFont = Font.regularSystemFont(12)

                pointsCell = row.addText(item.Points)
                pointsCell.widthWeight = 7
                pointsCell.titleFont = Font.regularSystemFont(12)  
                pointsCell.rightAligned()
            
                nrrCell = row.addText(item.NetRunRate)
                nrrCell.widthWeight = 15
                nrrCell.titleFont = Font.regularSystemFont(12)  
                nrrCell.rightAligned()
                
                formCell = row.addText("  " + item.Performance)
                formCell.widthWeight = 15
                formCell.titleFont = Font.semiboldSystemFont(12)    
                formCell.leftAligned()
                
                table.addRow(row)
                
            }
        }
        break
    }
    return table
}
