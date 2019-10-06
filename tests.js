let DateTime = require('./index')

let assert = (value1, value2, error) => {
    if (value1 != value2) {
        throw Error(`${error}.\nThese should've been === but they're not: ${value1} ${value2}\n\n`)
    } else {
        console.log("pass")
    }
}

// valid dates
let endOfThe90s = new DateTime('12/31/1999')
assert(endOfThe90s.day     , 31          , "endOfThe90s.day"     )
assert(endOfThe90s.month   , 12          , "endOfThe90s.month"   )
assert(endOfThe90s.year    , 1999        , "endOfThe90s.year"    )
assert(endOfThe90s.hour12  , 12          , "endOfThe90s.hour12"  )
assert(endOfThe90s.hour24  , 0           , "endOfThe90s.hour24"  )
assert(endOfThe90s.time    , '12:00am'   , "endOfThe90s.time"    )
assert(endOfThe90s.date    , '12/31/1999', "endOfThe90s.date"    )
assert(endOfThe90s.dayName , 'Friday'    , "endOfThe90s.dayName" )


let aNiceDay = new DateTime('12/18/1995')
assert(aNiceDay.day     ,  18           , "aNiceDay.day"        )
assert(aNiceDay.month   ,  12           , "aNiceDay.month"      )
assert(aNiceDay.year    ,  1995         , "aNiceDay.year"       )
assert(aNiceDay.hour12  ,  12           , "aNiceDay.hour12"     )
assert(aNiceDay.hour24  ,  0            , "aNiceDay.hour24"     )
assert(aNiceDay.time    ,  '12:00am'    , "aNiceDay.time"       )
assert(aNiceDay.date    ,  '12/18/1995' , "aNiceDay.date"       )
assert(aNiceDay.dayName ,  'Monday'     , "aNiceDay.dayName"    )

aNiceDay = new DateTime('1995-12-18')
assert(aNiceDay.day     ,  18           , "aNiceDay.day"        )
assert(aNiceDay.month   ,  12           , "aNiceDay.month"      )
assert(aNiceDay.year    ,  1995         , "aNiceDay.year"       )
assert(aNiceDay.hour12  ,  12           , "aNiceDay.hour12"     )
assert(aNiceDay.hour24  ,  0            , "aNiceDay.hour24"     )
assert(aNiceDay.time    ,  '12:00am'    , "aNiceDay.time"       )
assert(aNiceDay.date    ,  '12/18/1995' , "aNiceDay.date"       )
assert(aNiceDay.dayName ,  'Monday'     , "aNiceDay.dayName"    )

aNiceDay = new DateTime('1995-1-1')
assert(aNiceDay.day     ,  1            , "aNiceDay.day"        )
assert(aNiceDay.month   ,  1            , "aNiceDay.month"      )
assert(aNiceDay.year    ,  1995         , "aNiceDay.year"       )
assert(aNiceDay.hour12  ,  12           , "aNiceDay.hour12"     )
assert(aNiceDay.hour24  ,  0            , "aNiceDay.hour24"     )
assert(aNiceDay.time    ,  '12:00am'    , "aNiceDay.time"       )
assert(aNiceDay.date    ,  '01/01/1995' , "aNiceDay.date"       )
assert(aNiceDay.dayName ,  'Sunday'     , "aNiceDay.dayName"    )

aNiceDay = new DateTime('1995-2-1')
assert(aNiceDay.day     ,  1            , "aNiceDay.day"        )
assert(aNiceDay.month   ,  2            , "aNiceDay.month"      )
assert(aNiceDay.year    ,  1995         , "aNiceDay.year"       )
assert(aNiceDay.hour12  ,  12           , "aNiceDay.hour12"     )
assert(aNiceDay.hour24  ,  0            , "aNiceDay.hour24"     )
assert(aNiceDay.time    ,  '12:00am'    , "aNiceDay.time"       )
assert(aNiceDay.date    ,  '02/01/1995' , "aNiceDay.date"       )
assert(aNiceDay.dayName ,  'Wednesday'  , "aNiceDay.dayName"    )

for (let each of [ '12/31/1999', '2011-09-24T00:00:00' ]) {
    let aDate = new DateTime('12/31/1999')
    aDate.time = '1:30pm'
    assert(aDate.second ,   0         , 'aDate.second')
    assert(aDate.minute ,   30        , 'aDate.minute')
    assert(aDate.hour12 ,   1         , 'aDate.hour12')
    assert(aDate.hour24 ,   13        , 'aDate.hour24')
    assert(aDate.amPm   ,   'pm'      , 'aDate.amPm')
    assert(aDate.time   ,   '01:30pm' , 'aDate.time')
    assert(aDate.time12 ,   '01:30pm' , 'aDate.time12')
    assert(aDate.time24 ,   '13:30'   , 'aDate.time24')

    aDate.time = '12:30pm'
    assert(aDate.second ,   0         , 'aDate.second')
    assert(aDate.minute ,   30        , 'aDate.minute')
    assert(aDate.hour12 ,   12        , 'aDate.hour12')
    assert(aDate.hour24 ,   12        , 'aDate.hour24')
    assert(aDate.amPm   ,   'pm'      , 'aDate.amPm')
    assert(aDate.time   ,   '12:30pm' , 'aDate.time')
    assert(aDate.time12 ,   '12:30pm' , 'aDate.time12')
    assert(aDate.time24 ,   '12:30'   , 'aDate.time24')

    aDate.time = '12:30am'
    assert(aDate.second ,   0         , 'aDate.second')
    assert(aDate.minute ,   30        , 'aDate.minute')
    assert(aDate.hour12 ,   12        , 'aDate.hour12')
    assert(aDate.hour24 ,   00        , 'aDate.hour24')
    assert(aDate.amPm   ,   'am'      , 'aDate.amPm')
    assert(aDate.time   ,   '12:30am' , 'aDate.time')
    assert(aDate.time12 ,   '12:30am' , 'aDate.time12')
    assert(aDate.time24 ,   '00:30'   , 'aDate.time24')

    aDate.time = '1:30:20pm'
    assert(aDate.second ,   20         , 'aDate.second')

    aDate.time = '13:30:20'
    assert(aDate.second ,   20         , 'aDate.second')
    assert(aDate.hour12 ,    1         , 'aDate.hour12')
    assert(aDate.hour24 ,   13         , 'aDate.hour24')

    aDate.time = '13:30:20.502'
    assert(aDate.second ,   20.502     , 'aDate.second')
    assert(aDate.hour12 ,    1         , 'aDate.hour12')
    assert(aDate.hour24 ,   13         , 'aDate.hour24')

    aDate.time = '1:30:20.502am'
    assert(aDate.second ,   20.502     , 'aDate.second')
    assert(aDate.hour12 ,    1         , 'aDate.hour12')
    assert(aDate.hour24 ,    1         , 'aDate.hour24')
}




// invalid dates throw errors instead of failing silently
for (let each of [['blah'], [1,2,3], [-1], ['10/10/10'], ]) {
    let threwError = false
    try {
        new DateTime(...each)
    } catch (e) {
        threwError = true 
    }
    if (!threwError) {
        throw Error(`${each} didn't cause an error and it should have`)
    }
}


console.log(`All tests passed`)