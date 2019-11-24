const convertTime12to24 = (hours, pmOrAm) => {
    if (hours == "12") {
        hours = "00"
    }
    if (pmOrAm.match(/[pP][mM]/)) {
        hours = parseInt(hours, 10) + 12
    }
    return hours
}
const padZero = (amount) => {
    if (amount < 10) {
        return `0${amount-0}`
    } else {
        return amount
    }
}

const isPositiveInt = (value, name) => {
    value-=0
    if (typeof value != 'number' || value <= 0 || value != value) {
        throw Error(`${name}=${value} must be a positive integer`)
    } else {
        return value
    }
}
const createDateArguments = (...args) => {
    let [year, month, day, hour, minute, second, milisecond] = args
    switch (args.length) {
        case 0:
            return []
        case 1:
            return [ isPositiveInt(year,'year'), 0 ]
            break;
        case 2:
            return [ isPositiveInt(year,'year'), isPositiveInt(month,'month')-1 ]
            break;
        case 3:
            return [ isPositiveInt(year,'year'), isPositiveInt(month,'month')-1, isPositiveInt(day,'day') ]
            break;
        case 4:
            return [ isPositiveInt(year,'year'), isPositiveInt(month,'month')-1, isPositiveInt(day,'day'), hour ]
            break;
        case 5:
            return [ isPositiveInt(year,'year'), isPositiveInt(month,'month')-1, isPositiveInt(day,'day'), hour, minute ]
            break;
        case 6:
            return [ isPositiveInt(year,'year'), isPositiveInt(month,'month')-1, isPositiveInt(day,'day'), hour, minute, second ]
            break;
        default:
            return [ isPositiveInt(year,'year'), isPositiveInt(month,'month')-1, isPositiveInt(day,'day'), hour, minute, second, milisecond ]
            break;
    }
}
const inspectSymbol = (require && require('util').inspect.custom) || Symbol.for('inspect')
module.exports = class DateTime extends Date {
    constructor(...args) {
        // no argument
        if (args.length == 0) {
            super()
        } else {
            let dateStringArgument
            let arg = args[0]
            if (args.length > 1) {
                throw Error("The DateTime class only takes one argument.\nIf you want you do DateTime(Year, Month, ...etc) change it to DateTime([ Year, Month,  ...etc ])")
            }
            // assume unix epoch time
            if (typeof arg == 'number') {
                super(isPositiveInt(arg,'DateTime(arg'))
                this.timeIncluded = true
            } else if (arg instanceof Array) {
                super(...createDateArguments(...arg))
                if (arg.length > 3) {
                    this.timeIncluded = true
                }
            } else if (typeof arg == 'string') {
                arg = arg.trim()
                // formats:
                //     12/31/1999
                //     2011-09-24
                //     2011-09-24T00:00:00
                //     2011-09-24T00:00:00Z
                let format1 = arg.match(/(\d\d?)\/(\d\d?)\/(\d\d\d\d)/)
                let format2 = arg.match(/(\d\d\d\d)-(\d\d?)-(\d\d?)/)
                let format3 = arg.match(/(\d\d\d\d)-(\d\d?)-(\d\d?)T(\d\d?):(\d\d?):(\d\d?(?:\.\d+))/)
                let format4 = arg.match(/(\d\d\d\d)-(\d\d?)-(\d\d?)T(\d\d?):(\d\d?):(\d\d?(?:\.\d+))Z/)
                let years, months, days, hours, minutes, seconds, miliseconds
                if (format4) {
                    // this makes it in UTC time rather than relative to the current time zone
                    super(format4)
                    this.timeIncluded = true
                } else if (format3) {
                    years       = format3[1]
                    months      = format3[2]
                    days        = format3[3]
                    hours       = format3[4]
                    minutes     = format3[5]
                    seconds     = format3[6]
                    miliseconds = format3[7]
                    this.timeIncluded = true
                    super(...createDateArguments(years, months, hours, minutes, seconds, miliseconds))
                } else if (format2) {
                    years       = format2[1]
                    months      = format2[2]
                    days        = format2[3]
                    super(...createDateArguments(years, months, days))
                } else if (format1) {
                    months      = format1[1]
                    days        = format1[2]
                    years       = format1[3]
                    super(...createDateArguments(years, months, days))
                } else {
                    throw Error(`Invalid Date format: ${arg}, please use one of: \n    12/31/1999\n    2011-09-24\n    2011-09-24T00:00:00\n    2011-09-24T00:00:00Z`)
                }
            }
        }
    }
    get isInvalid() {
        let time = this.getTime()
        if (time != time) {
            return true
        } else {
            return false
        }
    }
    get utcOffset() {
        if (this.isInvalid) {return null}
        return Math.abs(this.getTimezoneOffset()*60000)
    }
    get second() {
        if (this.isInvalid) {return null}
        return super.getSeconds() + super.getMilliseconds()/1000
    }
    get minute() {
        if (this.isInvalid) {return null}
        return super.toLocaleTimeString().match(/(\d+):(\d+):(\d+) ([AP]M)/)[2]-0
    }
    get hour12() {
        if (this.isInvalid) {return null}
        return super.toLocaleTimeString().match(/(\d+):(\d+):(\d+) ([AP]M)/)[1]-0
    }
    get amPm() {
        return (this.hour24 >= 12)? 'pm' : 'am'
    }
    get hour24() {
        if (this.isInvalid) {return null}
        let match = super.toLocaleTimeString().match(/(\d+):(\d+):(\d+) ([AP]M)/)
        return convertTime12to24(match[1], match[4])
    }
    get time() {
        return this.time12
    }
    set time(time) {
        this.timeIncluded = true
        let match = time.match(/(\d+):(\d+)(.*)/)
        if (match) {
            let hour = match[1]
            let minute = match[2]
            let seconds = null
            let miliseconds = 0
            let everythingElse = match[3]
            // check for seconds
            let checkForSeconds = everythingElse.match(/:(\d+)(?:\.(\d+))?(.*)/)
            if (checkForSeconds) {
                seconds = checkForSeconds[1]-0
                checkForSeconds[2] && (miliseconds = checkForSeconds[2])
                everythingElse = checkForSeconds[3]
            }
            // check for am/pm
            let modifierMatch = everythingElse.trim().match(/((?:[aA]|[pP])[mM])/)
            if (modifierMatch) {
                hour = convertTime12to24(hour, modifierMatch[1])
            }
            super.setHours(hour, minute, seconds, miliseconds)
        }
    }
    get time12() {
        if (this.isInvalid) {return null}
        // it is pm if hours from 12 onwards
        return `${padZero(this.hour12)}:${padZero(this.minute)}${this.amPm}`
    }
    get time24() {
        if (this.isInvalid) {return null}
        return `${padZero(this.hour24)}:${padZero(this.minute)}`
    }
    get unix() {
        if (this.isInvalid) {return null}
        return super.getTime()
    }
    get month() {
        if (this.isInvalid) {return null}
        return super.toLocaleDateString().match(/(\d+)\/\d+\/\d+/)[1]-0
    }
    get monthName() {
        if (this.isInvalid) {return null}
        return ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][super.getMonth()]
    }
    get timeOfDayAsSeconds() {
        if (this.isInvalid) {return null}
        return (((time.hour24*60) + time.minute)*60 + time.second)
    }
    get day() {
        if (this.isInvalid) {return null}
        return super.toLocaleDateString().match(/\d+\/(\d+)\/\d+/)[1]-0
    }
    get dayName() {
        return this.weekDay
    }
    get weekDay() {
        if (this.isInvalid) {return null}
        let weekDay = super.getDay()
        switch (weekDay) {
            case 0: return 'Sunday'
            case 1: return 'Monday'
            case 2: return 'Tuesday'
            case 3: return 'Wednesday'
            case 4: return 'Thursday'
            case 5: return 'Friday'
            case 6: return 'Saturday'
        }
        return weekDay
    }
    get weekIndex() {
        return super.getDay()
    }
    get year() {
        if (this.isInvalid) {return null}
        return super.toLocaleDateString().match(/\d+\/\d+\/(\d+)/)[1]-0
    }
    get date() {
        if (this.isInvalid) {return null}
        return `${padZero(this.month)}/${padZero(this.day)}/${this.getFullYear()}`
    }
    toString() {
        if (this.isInvalid) {return null}
        let date = this.date
        if (this.timeIncluded) {
            date = `${date}, ${this.time}`
        }
        return date
    }
    inspect()                  { return this.toString() }
    [inspectSymbol]()          { return this.toString() }
    valueOf()                  { return this.unix  }
    toPrimitive()              { return this.unix  }
    [Symbol.toPrimitive](hint) { return this.unix  }
}