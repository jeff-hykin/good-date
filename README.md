## Good Date

A Javascript date class that actually makes sense

```javascript
import DateTime from 'https://cdn.skypack.dev/good-date'

// a valid date with no time
let aDate = new DateTime('12/31/1999')
let aDate = new DateTime('1999-12-31')
let aDate = new DateTime('1999-12-31T00:00:00')

aDate.day       // 31
aDate.month     // 12
aDate.year      // 1999
aDate.date      // 12/31/1999

// easy time set/get
aDate.time = '1:30pm'
aDate.time = '1:30:20pm'
aDate.time = '1:30:20.5'
aDate.time = '1:30:20.5am'
aDate.second  // 20
aDate.minute  // 30
aDate.amPm    // pm
aDate.hour12  // 1
aDate.hour24  // 13

// helpers
aDate.monthName // December
aDate.dayName   // Friday
aDate.weekIndex // 5
aDate.unix      // milliseconds since the unix epoch

// an invalid date throw errors instead of failing silently
let aDate = new DateTime('Blah')
```
