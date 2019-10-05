let inspectSymbol = (require && require('util').inspect.custom) || Symbol.for("inspect")
module.exports = class DateTime extends Date {
    constructor(...args) {
        var date, time
        if (args[0] && (typeof args[0] == 'string')) {
            date = args[0]
            time = null
        } else if (args[0] instanceof Date) {
            date = args[0].getTime()
        } else if (args[0] instanceof Object) {
            var {date, time}  = args[0]
        }
        let aDate = new Date(date)
        super(aDate.getTime() + Math.abs(aDate.getTimezoneOffset()*60000))
        if (time) {
            this.time = time
        }
    }
    get utcOffset() {
        return Math.abs(this.getTimezoneOffset()*60000)
    }
    get isInvalid() {
        let time = this.getTime()
        if (time != time) {
            return true
        } else {
            return false
        }
    }
    get second() {
        if (this.isInvalid) {return null}
        return super.getSeconds()
    }
    get minute() {
        if (this.isInvalid) {return null}
        return (super.getMinutes() - this.utcOffset / 60000) % 60
    }
    get hour() {
        if (this.isInvalid) {return null}
        return super.getHours() - this.utcOffset / 3600000
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
            let everythingElse = match[3]
            // check for seconds
            let checkForSeconds = everythingElse.match(/:(\d+(?:\.\d+)?)(.*)/)
            if (checkForSeconds) {
                seconds = checkForSeconds[1]-0
                everythingElse = match[2]
            }
            // check for am/pm
            let modifierMatch = everythingElse.trim().match(/((?:[aA]|[pP])[mM])/)
            if (modifierMatch) {
                hour = convertTime12to24(hour, modifierMatch[1])
            }
            super.setHours(hour, minute, seconds)
        }
    }
    get time12() {
        if (this.isInvalid) {return null}
        let suffix, hours = this.hour, minutes = this.minute
        // it is pm if hours from 12 onwards
        suffix = (hours >= 12)? 'pm' : 'am'
        hours = ((hours + 11) % 12 + 1)
        return `${padZero(hours)}:${padZero(minutes)}${suffix}`
    }
    get time24() {
        if (this.isInvalid) {return null}
        return `${padZero(this.hour)}:${padZero(this.minute)}`
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
            case 1: return 'Monday'
            case 2: return 'Tuesday'
            case 3: return 'Wednesday'
            case 4: return 'Thursday'
            case 5: return 'Friday'
            case 6: return 'Saturday'
            case 7: return 'Sunday'
        }
        return weekDay
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
    valueOf()                  { return this.toString() }
    toPrimitive()              { return this.unix  }
    [Symbol.toPrimitive](hint) { return this.unix  }
}