/*
IPL Widget
By: @abbyjeet
On: 2022-04-05
source: https://github.com/abbyjeet/scriptable-widgets
based on: 
The Golf Club Wdiget by @supermamon
*/

// preferences
const FONT_SIZE = 12
const EXCLUDE_HC = true
const HEADER_COLOR = Color.red()
const ROW_COLOR = Color.blue()
const BACKGROUND_COLOR = Color.black()
const url = 'https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/feeds/stats/60-groupstandings.js'

const bgimage = "https://raw.githubusercontent.com/abbyjeet/scriptable-widgets/main/ipl-new.jpg"

const sc = new Color("#19398a",0.95)
const ec = new Color("#18184a",0.95)
const gradC = new LinearGradient()
    gradC.colors = [sc, ec]
    gradC.locations = [0,1]


//callback function
function ongroupstandings(x){
    return x.points
}

// call api, execute callback and get data
async function loadItems(){
    let req = new Request(url)
    let json = await req.loadString()
    let data = eval("(function(){ return " + json + "}())")
    return data    
}



const font = Font.regularSystemFont(FONT_SIZE) 

// adjust only if preferred
// const colWidths = [45,120,45,45,45,45]

const colWidths = [25,172,25,40,40]

const data = await loadItems()

const headers = ["", "Team","Pts","NRR","Form"]

const keys = ["TeamLogo", "TeamName","Points","NetRunRate","Performance"]

const widgetFamily = config.widgetFamily ? config.widgetFamily : 'large'

const widget = new ListWidget()// 
// widget.backgroundColor = BACKGROUND_COLOR

let imgBg = await new Request(bgimage).loadImage()
widget.backgroundImage = imgBg
widget.backgroundGradient = gradC
// widget.setPadding(0,0,0,0)

// add the headers
const headerStack = widget.addStack()
headerStack.layoutHorizontally()
// headerStack.setPadding(0,0,0,0)

let idx = -1
for (header of headers) {
  idx++
  if (EXCLUDE_HC && idx==5) continue;
  const headerText = header
  const headerCell = headerStack.addStack()
  headerCell.layoutHorizontally()
//   headerCell.backgroundColor = HEADER_COLOR
  headerCell.size = new Size(colWidths[idx],24)
  
//   headerCell.addSpacer(2)
  const textElement = headerCell.addText(headerText)
  textElement.font = Font.boldSystemFont(14)
  
  headerStack.addSpacer(1) // between cells
  
  headerCell.centerAlignContent()
  
  if(idx==1) headerCell.addSpacer()
}

widget.addSpacer(1)
// add the data

// limit the number of rows based on widget size

const rows = data.slice(0, widgetFamily=='large'?10:5)

for (const row of rows) {
  const rowStack = widget.addStack()
  rowStack.layoutHorizontally()
  let idx = -1
  for (const cell of keys) {
    idx++
    if (EXCLUDE_HC && idx==5) continue;
    const cellText = row[cell]
    
    if(idx==0){ 
       // logo
      const dataCell = rowStack.addStack() 
        dataCell.layoutHorizontally()
//     dataCell.backgroundColor = Color.blue()
    dataCell.size = new Size(colWidths[idx],24)
        let imgObj = await new Request(cellText).loadImage()
        let img = dataCell.addImage(imgObj)
    } else {
    
    const dataCell = rowStack.addStack()
    dataCell.layoutHorizontally()
//     dataCell.backgroundColor = Color.blue()
    dataCell.size = new Size(colWidths[idx],24)
    
    dataCell.addSpacer(1)
    
    let textElement = ""
    if(idx==4){
      let balls = cellText.replaceAll(",", "").replaceAll("W", "🟢").replaceAll("L", "🔴")
      textElement=dataCell.addText(balls)
      textElement.font = Font.regularSystemFont(7)
}else{
  textElement=dataCell.addText(cellText)
  textElement.font = font
}

    
    
    dataCell.centerAlignContent()
    
    if(idx==1) dataCell.addSpacer()
  }
    
    rowStack.addSpacer(1)  // between cells
  } 
  widget.addSpacer(1) // between rows
}


if (config.runsInApp) await widget[`present${widgetFamily.split('').map( (c,i)=>(i==0?c.toUpperCase():c)).join('')}`]()
Script.setWidget(widget)
Script.complete()
