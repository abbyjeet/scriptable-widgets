// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-gray; icon-glyph: calendar-alt;
/*
IPL Widget
By: @abbyjeet
On: 2022-04-05
source: https://github.com/abbyjeet/scriptable-widgets
based on: 
The Golf Club Wdiget by @supermamon
*/

// arguments
const WARG = args.widgetParameter
const widgetFamily = config.widgetFamily ? config.widgetFamily : 'large'

// preferences
const COLOR_BLUE1 = "#19398a"
const COLOR_BLUE2 = "#18184a"
const BGIMAGE = "https://raw.githubusercontent.com/abbyjeet/scriptable-widgets/main/ipl.jpg"
const FONT7 = Font.regularSystemFont(7) 
const FONT12 = Font.regularSystemFont(12) 
const FONT14 = Font.boldSystemFont(14)
const COLWIDTHS = [25,172,25,40,40]
const HEIGHT = 29
const EXCLUDE_HC = false //headercells
const HEADERS = ["", "Team","Pts","NRR","Form"]
const KEYS = ["TeamLogo", "TeamName","Points","NetRunRate","Performance"]


// URLs
const pointstable = 'https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/feeds/stats/60-groupstandings.js'
const schedule = 'https://ipl-stats-sports-mechanic.s3.ap-south-1.amazonaws.com/ipl/feeds/60-matchschedule.js'

// Background color
const sc = new Color(COLOR_BLUE1,0.95)
const ec = new Color(COLOR_BLUE2,0.95)
const gradC = new LinearGradient()
    gradC.colors = [sc, ec]
    gradC.locations = [0,1]

// widget
const widget = new ListWidget()

// apply background image and background color
let imgBg = await new Request(BGIMAGE).loadImage()
widget.backgroundImage = imgBg
widget.backgroundGradient = gradC


//callback function// 
function ongroupstandings(x){
    return x.points
}

function matchschedule(x){
    return x.Matchsummary
}

// call api, execute callback and get data
async function callbackFn(url){
    let req = new Request(url)
    let json = await req.loadString()
    let data = eval("(function(){ return " + json + "}())")
    return data    
}


async function pointsTableWidget(){
    const pointsTable = await callbackFn(pointstable)

    const rows = pointsTable.slice(0, widgetFamily=='large'?10:4)

    
    // add the headers
    const headerStack = widget.addStack()
    headerStack.layoutHorizontally()
    // headerStack.setPadding(0,0,0,0)

    let idx = -1
    for (header of HEADERS) {
      idx++
      if (EXCLUDE_HC && idx==5) continue;
      const headerText = header
      const headerCell = headerStack.addStack()
      headerCell.layoutHorizontally()
        //   headerCell.backgroundColor = HEADER_COLOR
      headerCell.size = new Size(COLWIDTHS[idx],HEIGHT)

        //   headerCell.addSpacer(2)
      const textElement = headerCell.addText(headerText)
      textElement.font = FONT14

      headerStack.addSpacer(1) // between cells

      headerCell.centerAlignContent()

      if(idx==1) headerCell.addSpacer()
    }

    widget.addSpacer(1)


    for (const row of rows) {
      const rowStack = widget.addStack()
      rowStack.layoutHorizontally()
      let idx = -1
      for (const cell of KEYS) {
        idx++
        if (EXCLUDE_HC && idx==5) continue;
        const cellText = row[cell]

        if(idx==0){ 
           // logo
          const dataCell = rowStack.addStack() 
            dataCell.layoutHorizontally()
        //     dataCell.backgroundColor = Color.blue()
        dataCell.size = new Size(COLWIDTHS[idx],HEIGHT)
            let imgObj = await new Request(cellText).loadImage()
            let img = dataCell.addImage(imgObj)
        } else {

        const dataCell = rowStack.addStack()
        dataCell.layoutHorizontally()
        //     dataCell.backgroundColor = Color.blue()
        dataCell.size = new Size(COLWIDTHS[idx],HEIGHT)

        dataCell.addSpacer(1)

        let textElement = ""
        if(idx==4){
            //       cellText = "W,W,L,W,L"
          let balls = cellText.replaceAll(",", "").replaceAll("W", "🟢").replaceAll("L", "🔴")
          balls = [...balls].reverse().join("").substring(0,6)
            // 
            // dataCell.addSpacer(1)
          textElement=dataCell.addText(balls)
          textElement.font = FONT7
    }else{
      textElement=dataCell.addText(cellText)
      textElement.font = FONT12
    }

        dataCell.centerAlignContent()

        if(idx==1) dataCell.addSpacer()
      }

        rowStack.addSpacer(1)  // between cells
      } 
      widget.addSpacer(1) // between rows
    }   
}

await function favouriteTeamWidget(){
    // add the text
    const textEl = widget.addText("Favourite")
}

await function upcomingMatchWidget(){
    const matches = await callbackFn(pointstable)
    const upcoming = matches.filter(({MatchStatus}) => MatchStatus === 'UpComing');
    
    console.log(upcoming)
    
    // add the text
    const textEl = widget.addText("Upcoming")
}

await function lastMatchWidget(){
    const matches = await callbackFn(pointstable)
    const past = matches.filter(({MatchStatus}) => MatchStatus === 'Post');
    
    console.log(past)
    
    // add the text
    const textEl = widget.addText("Last match")
} 

// present widget - in app or in widget
if (widgetFamily === "small") {
    await favouriteTeamWidget()
} else if (widgetFamily === "medium" && WARG === "upc") {
    await upcomingMatchWidget()
} else if (widgetFamily === "medium" && WARG === "last") {
    await lastMatchWidget()
} else {
    await pointsTableWidget()
}

if (config.runsInApp) await widget[`present${widgetFamily.split('').map( (c,i)=>(i==0?c.toUpperCase():c)).join('')}`]()
Script.setWidget(widget)
Script.complete()
