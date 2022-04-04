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
            // row.height = 60
            // row.cellSpacing = 10

            nameCell = row.addText("")
            nameCell.widthWeight = 10
            
            nameCell = row.addText("Team")
            nameCell.widthWeight = 70
//             nameCell.titleFont = headline()
            
            pointsCell = row.addText("Points")
            pointsCell.widthWeight = 5
            
            nrrCell = row.addText("NRR")
            nrrCell.widthWeight = 15

            table.addRow(row)
            for (const item of items) {
                let row = new UITableRow()
                // row.height = 60
                // row.cellSpacing = 10

                imageCell = row.addImageAtURL(item.TeamLogo)
                imageCell.widthWeight = 10
                
                nameCell = row.addText(item.TeamName)
                nameCell.widthWeight = 70  
//                 nameCell.titleFont = body()

                pointsCell = row.addText(item.Points)
                pointsCell.widthWeight = 5
            
                nrrCell = row.addText(item.NetRunRate)
                nrrCell.widthWeight = 15
                table.addRow(row)
            }
        }
        break
    }
    return table
}
