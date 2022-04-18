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


// widget
const widget = new ListWidget()


// arguments
const WARG = args.widgetParameter || "MI"
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
let sc = new Color(COLOR_BLUE1,0.95)
let ec = new Color(COLOR_BLUE2,0.95)
let gradC = new LinearGradient()
    gradC.colors = [sc, ec]
    gradC.locations = [0,1]

// apply background color
widget.backgroundGradient = gradC

async function setupWidget(){  
  if (config.runsInApp) await widget[`present${widgetFamily.split('').map( (c,i)=>(i==0?c.toUpperCase():c)).join('')}`]()
  Script.setWidget(widget)
  Script.complete()
}

// check if online, else exist
const request = new Request("https://google.com");
try {
  await request.load();
} catch (exception) {
  /*
  const row1 = widget.addStack()
  row1.layoutHorizontally()
  row1.centerAlignContent()
  
  row1.addSpacer()
  const emoji = row1.addText("😭")
  emoji.font = Font.lightSystemFont(100)
  row1.addSpacer()
  
  const row2 = widget.addStack()
  row2.layoutHorizontally()
  row2.centerAlignContent()
  
  row2.addSpacer()
  const textEl = row2.addText("No internet!")
  row2.addSpacer()
  
  await setupWidget()
  */
  return
}
  


// apply background image
let imgBg = await new Request(BGIMAGE).loadImage()
widget.backgroundImage = imgBg



//callback function// 
function ongroupstandings(x){
    return x.points
}

function MatchSchedule(x){
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






async function favouriteTeamWidget(){
  const HDRS = ["M","W","L","%","P"]
  const K = ["Matches", "Wins","Loss","NetRunRate","Points"]
  
  const pointsTable = await callbackFn(pointstable)

const favteam = pointsTable.filter(({TeamCode}) => TeamCode === WARG);

/*
if(favteam.length < 0){
  imgBg = await new     Request(favteam[0].TeamLogo).loadImage()  
  
    sc = new Color("#000",0.0)
    cc = new Color(COLOR_BLUE1,0)
    ec = new Color("#000",0.0)
    gradC = new LinearGradient()
    gradC.colors = [sc,ec]
    gradC.locations = [0,1]


  dctx = new DrawContext()
  dctx.respectScreenScale = true
//   dctx.drawImageInRect(imgBg, new Rect(-50,-42,300,300))
  dctx.drawImageInRect(imgBg, new Rect(0,0,100,100))
  widget.backgroundImage = dctx.getImage()
  widget.backgroundColor = Color.black()
  widget.backgroundGradient = gradC
}
*/

if(favteam.length > 0){

//     console.log(favteam)
    
//     widget.backgroundImage = null
    
    const row1 = widget.addStack()
    row1.layoutHorizontally()
    row1.centerAlignContent()
    
    row1.addSpacer()
    
    imgBg = await new     Request(favteam[0].TeamLogo).loadImage()  
    const logo = row1.addImage(imgBg)
    
    row1.addSpacer()
  
    const name = row1.addText(favteam[0].TeamCode)
    name.font = new Font("Futura-CondensedMedium", 38)
    name.textColor = Color.yellow()
    
    

    widget.addSpacer()

    const row2 = widget.addStack()
    row2.centerAlignContent()
  
  
    // add the text
//     const textEl = row2.addText("Favourite")
//     widget.addSpacer()

    // add the headers
    const headerStack = row2.addStack()
    headerStack.layoutHorizontally()
    
    let idx = -1
    for (header of HDRS) {
      idx++
      const headerText = header
      const headerCell = headerStack.addStack()
      headerCell.layoutHorizontally()
  
      headerCell.size = new Size(30,HEIGHT)

        //   headerCell.addSpacer(2)
      const textElement = headerCell.addText(headerText)
      textElement.font = FONT14

      headerStack.addSpacer(1) // between cells

      headerCell.centerAlignContent()
    }

    const row3 = widget.addStack()
    row3.centerAlignContent()

    const dataStack = row3.addStack()
    dataStack.layoutHorizontally()
    
    idx = -1
    for (key of K) {
      idx++
      const cellText = favteam[0][key]
      const cell = dataStack.addStack()
      cell.layoutHorizontally()
  
      cell.size = new Size(30,HEIGHT)

        //   headerCell.addSpacer(2)
      const textElement = cell.addText(cellText.substring(0, 5))

      if(idx === 3){
        textElement.font = Font.systemFont(10)
      } else {
        textElement.font = FONT12
      }

      dataStack.addSpacer(1) // between cells

      cell.centerAlignContent()
    }
    
    widget.addSpacer(1)
    
  }
}






async function upcomingMatchWidget(){
    const matches = await callbackFn(schedule)
    const upcoming = matches.filter(({MatchStatus}) => MatchStatus === 'UpComing'); 
// or Live
  
  let match = {}
  if(upcoming.length > 0){
    match = upcoming[0]
  }
    
    console.log(upcoming[0])
    
    // add the text
    //const textEl = widget.addText("Upcoming")


    
    const title = widget.addText(match.MatchName.replace("VS", "\nVs\n"))  
  title.centerAlignText()
  title.font = new Font("GillSans-SemiBoldItalic", 20)
  title.textColor = Color.yellow()

    widget.addSpacer()

    const datetime = widget.addText(match.MatchDateNew + " at " + match.MatchTime + " IST")  
  datetime.centerAlignText()
  datetime.font = FONT14
  
    //widget.addSpacer()

    const venue = widget.addText("on " + match.GroundName)  
  venue.centerAlignText()
  venue.font = FONT12
}





async function lastMatchWidget(){
    const matches = await callbackFn(schedule)
    const past = matches.filter(({MatchStatus}) => MatchStatus === 'Post');
    
    let match = {}
  if(past.length > 0){
    match = past[0]
  }
    
//     console.log(past[0])
    
    // add the text
    //const textEl = widget.addText("Upcoming")


// const result = widget.addText("ROYAL CHALLENGERS BANGALORE WON BY 7 WICKETS")  
// 
const result = widget.addText(match.Comments)
  result.centerAlignText()
  result.font = Font.boldSystemFont(16)
  result.textColor = Color.green()

//     widget.addSpacer()
    
    const title = widget.addText(match.MatchName.replace("VS", "\nVs\n"))  
  title.centerAlignText()
  title.font = new Font("GillSans-SemiBoldItalic", 14)
title.textColor = Color.yellow()



//     widget.addSpacer()

    const datetime = widget.addText(match.MatchDateNew + " at " + match.MatchTime + " IST")  
  datetime.centerAlignText()
  datetime.font = Font.regularSystemFont(10)
  
    //widget.addSpacer()

    const venue = widget.addText("on " + match.GroundName)  
  venue.centerAlignText()
  venue.font = FONT7
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


setupWidget()
