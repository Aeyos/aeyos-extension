/**
 * Aeyos JS extension LIB
 *
 * @author {@link http://guthub.com/aeyos Aeyos}
 */

if (typeof window === 'object') {
  if (window.Array && window.Array.prototype) {
    /**
     * Array Prototype Extension
     * @module AeyosExtension/Array
     */

    /**
     * Removes empty (null, undefined and UNtrue) from an array
     * @function removeEmpty
     * @return {Array} Array without empty elements
     */
    Array.prototype.removeEmpty = function() {
      var index = 0
      this.forEach((v,i,a) => {
        if (typeof v !== 'undefined' && typeof v !== 'null' && v) {
          a[index++] = v
        }
      })
      this.splice(index, this.length)
      return this
    }
    /**
     * Gets a binary range given by two values
     * @function getBinaryRange
     * @description Finds the index of the closest (smaller or equal) element compared to A, and the closest (equal or bigger) element compared to B
     * @param  a Comparable value, the minimal range
     * @param  b Comparable value, the maximum range
     * @return {Array} A 2-value array containing the range index
     */
    Array.prototype.getBinaryRange = function(a, b) {
      if (this[0] > b) return []
      if (this[this.length - 1] < a) return []

      var ra = 0
      var rb = this.length

      while (this[ra] < a) {
        ra ++
      }
      while (this[rb - 1] > b) {
        rb --
      }

      return [ra, rb]
      // return [this.binarySearch(a, true), this.binarySearch(b, true) + 1]
    }
    /**
     * Makes a binary search on an array
     * @function binarySearch
     * @param  {Number}  i     The element to be found
     * @param  {Boolean} loose If it should return the closest index to the number to be found
     * @return {Number}        The index of the element
     */
    Array.prototype.binarySearch = function(i, loose) {
      var counter = 1
      function bs(x, a, b, l) {
        var h = (a + b) / 2 | 0
        if (counter++ > 20) return 0
        if (b < a) {
          return l ? h : -1
        } else if (x === this[h]) {
          return h
        } else if (x > this[h]) {
          return bs.call(this, x, h + 1, b, l)
        } else {
          return bs.call(this, x, a, h - 1, l)
        }
      }
      return bs.call(this, i, 0, this.length - 1, loose || false)
    }
  }

  if (window.CanvasRenderingContext2D && window.CanvasRenderingContext2D.prototype) {
    /**
     * Canvas Render Context Prototype Extension
     * @module AeyosExtension/CanvasCtx2D
     */

    /**
     * Draws an arrow head
     * @function arrowHead
     * @param  {Number} fx     X of the starting point
     * @param  {Number} fy     Y of the starting point
     * @param  {Number} tx     X of the ending point which also has the arrow tip
     * @param  {Number} ty     Y of the ending point which also has the arrow tip
     * @param  {Number} fill   Filled (true) or stroked (false) arrow tip
     * @param  {Number} length Size of the tip
     */
    CanvasRenderingContext2D.prototype.arrowHead = function(fx, fy, tx, ty, fill, length) {
      var headlen = length || 10
      var angle = Math.atan2(ty - fy, tx - fx)
      if (fill) {
        headlen *= 2
        var p1x = tx - headlen * Math.cos(angle - Math.PI / 6)
        var p1y = ty - headlen * Math.sin(angle - Math.PI / 6)
        var p2x = tx - headlen * Math.cos(angle + Math.PI / 6)
        var p2y = ty - headlen * Math.sin(angle + Math.PI / 6)
        this.moveTo(fx, fy)
        this.lineTo((p1x + p2x) / 2, (p1y + p2y) / 2)
        this.stroke()
        this.beginPath()
        this.lineTo(p1x, p1y)
        this.lineTo(tx, ty)
        this.lineTo(p2x, p2y)
        this.closePath()
        this.fill()
      } else {
        this.moveTo(fx, fy)
        this.lineTo(tx, ty)
        this.moveTo(tx, ty)
        this.lineTo(tx - headlen * Math.cos(angle - Math.PI / 6), ty - headlen * Math.sin(angle - Math.PI / 6))
        this.moveTo(tx, ty)
        this.lineTo(tx - headlen * Math.cos(angle + Math.PI / 6), ty - headlen * Math.sin(angle + Math.PI / 6))
        this.stroke()
      }
    }
    /**
     * Clears whole Canvas
     * @function clear
     */
    CanvasRenderingContext2D.prototype.clear = function() {
      this.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
  }

  if (window.console) {
    /**
     * Console Prototype Extension
     * @module AeyosExtension/Console
     * @property {Boolean} _debugEnabled - The debugging state, on (true), off (false)
     */
    console._debugEnabled = false
    /**
     * Overrides default console.debug (normally an alias to console.log)
     * @function debug
     * @description Needs console._debug === true
     * @param descriptor A string describing the name of the log, if preceded by @, calls console.warn, if preceded by ! calls console.error, if equals #f, gives a purple color and puts a function sign before
     * @param vars       Unlimited variables to be called by the console.[log/warn/error] method
     */
    console.debug = function() {
      if (!console._debugEnabled) return false
      var mode = arguments[0][0]
      if (mode === '@') {
        var parameters = [`%c[${arguments[0].replace('@', '')}]: %c${arguments[1]}`, 'color:black;font-weight:800', 'reset']
        for (var i=2 ; i<arguments.length ; i++) {
          parameters.push(arguments[i])
        }
        console.warn.apply(null, parameters)
      } else if (mode === '!') {
        var parameters = [`%c[${arguments[0].replace('!', '')}]: %c${arguments[1]}`, 'color:black;font-weight:800', 'reset']
        for (var i=2 ; i<arguments.length ; i++) {
          parameters.push(arguments[i])
        }
        console.error.apply(null, parameters)
      } else if (arguments[0] === '#f') {
        var parameters = [`%cƒ(${arguments[1].toUpperCase()}): %c`, 'color:purple; font-weight:800', 'reset']
        for (var i=2 ; i<arguments.length ; i++) {
          parameters.push(arguments[i])
        }
        console.log.apply(null, parameters)
      } else {
        var parameters = [`%c[${arguments[0]}]: %c${arguments[1]}`, 'color:green;font-weight:800', 'reset']
        for (var i=2 ; i<arguments.length ; i++) {
          parameters.push(arguments[i])
        }
        console.log.apply(console, parameters)
      }
    }
  }

  if (window.Date && window.Date.prototype) {
    /**
     * Date Prototype Extension
     * @module AeyosExtension/Date
     * @property {Number} secondInMs - How many milliseconds are in a second
     * @property {Number} minuteInMS - How many milliseconds are in a minute
     * @property {Number} hourInMS - How many milliseconds are in a hour
     * @property {Number} dayInMS - How many milliseconds are in a day
     * @property {Number} weekInMS - How many milliseconds are in a week
     */
    Date.secondInMS = 1000;
    Date.minuteInMS = 60000;
    Date.hourInMS = 3600000;
    Date.dayInMS = 86400000;
    Date.weekInMS = 604800000;
    /**
     * Gives the time in MS
     * @function secondsToMs
     * @param  {Number} n Number of seconds
     * @return {Number}   Number of seconds in milliseconds
     */
    Date.secondsToMS = function(n) {
      return n * Date.secondInMS
    }
    /**
     * Gives the time in MS
     * @function minutesToMs
     * @param  {Number} n Number of minutes
     * @return {Number}   Number of minutes in milliseconds
     */
    Date.minutesToMS = function(n) {
      return n * Date.minuteInMS
    }
    /**
     * Gives the time in MS
     * @function hoursToMs
     * @param  {Number} n Number of hours
     * @return {Number}   Number of hours in milliseconds
     */
    Date.hoursToMS = function(n) {
      return n * Date.hourInMS
    }
    /**
     * Gives the time in MS
     * @function daysToMs
     * @param  {Number} n Number of days
     * @return {Number}   Number of days in milliseconds
     */
    Date.daysToMS = function(n) {
      return n * Date.dayInMS
    }
    /**
     * Gives the time in MS
     * @function weeksToMs
     * @param  {Number} n Number of weeks
     * @return {Number}   Number of weeks in milliseconds
     */
    Date.weeksToMS = function(n) {
      return n * Date.weekInMS
    }
    /**
     * Wheter the current date object is on DST or not
     * @function dst
     * @return {Boolean} False if not on DST, true otherwise
     */
    Date.prototype.dst = function() {
      return this.getTimezoneOffset() < this.stdTimezoneOffset()
    }
    /**
     * Gets date string on a YYYY-MM-DD 00:00:00 format
     * @function getHyphenDate
     * @deprecated
     * @return {String} The date string
     */
    Date.prototype.getHyphenDate = function() {
      return this.toHyphenString(3)
    }
    /**
     * Returns the timezone offset
     * @function stdTimezoneOffset
     * @return {Number} The timezone offset
     */
    Date.prototype.stdTimezoneOffset = function() {
      var jan = new Date(this.getFullYear(), 0, 1)
      var jul = new Date(this.getFullYear(), 6, 1)
      return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset())
    }
    /**
     * Gets date in a hyphen string format
     * @function toHyphenString
     * @param  {Number} n Deepness of the date, from 1 (year) all the way to 7 (milliseconds)
     * @return {String}   The date string
     */
    Date.prototype.toHyphenString = function(n) {
      var string = ''
      n = n || 7
      for (var i = 0 ; i < n ; i++) {
        switch (i) {
          case 0: // Years
            string = `${this.getFullYear()}`
            break;
          case 1: // Months
            string += `-${this.getMonth() + 1}`
            break;
          case 2: // Days
            string += `-${this.getDate()}`
            break;
          case 3: // Hours
            string += ` ${('0' + this.getHours()).slice(-2)}`
            break;
          case 4: // Minutes
            string += `:${('0' + this.getMinutes()).slice(-2)}`
            break;
          case 5: // Seconds
            string += `:${('0' + this.getSeconds()).slice(-2)}`
            break;
          case 6: // Milliseconds
            string += `:${('00' + this.getMilliseconds()).slice(-3)}`
            break;
        }
      }
      return string
    }
    /**
     * Gets the next date when a DST change is going to occur
     * @function getNextDSTChange
     * @return {Date} The day the change is going to happen
     */
    Date.prototype.getNextDSTChange = function() {
      var today = new Date(this)
      today.setHours(0)
      today.setMinutes(0)
      today.setSeconds(0)
      today.setMilliseconds(0)

      var limit = today.getTime() + 366 * Date.dayInMS
      var dst = today.dst()

      while (today.getTime() < limit) {
        if (today.dst() !== dst) {
          // console.log('DST @', today.toHyphenString())
          // if (dst) {
            // var string = today.toString()
            // console.log('VERÃO > NORMAL')
            // console.log(today.getTime(), today.getTime() + 3600000)
            // console.log(new Date(today.getTime()), new Date(today.getTime() + 3600000), today.getTime() + 3600000 - today.getTime())
          // } else {
            // var string = today.toString()
            // console.log('NORMAL > VERÃO')
            // console.log(today.getTime() - 3600000, today.getTime())
            // console.log(new Date(today.getTime() - 3600000), new Date(today.getTime()), today.getTime() - today.getTime() - 3600000)
          // }
          break
        }
        today.setHours(24)
      }
      return today
    }
    /**
     * Gets the number of the week in a month
     * @function getWeekNumber
     * @param  {Boolean} float Returns the result as float (true) or integer (false | undefined)
     * @return {Number} The n-th week of the year, starting at 1
     */
    Date.prototype.getWeeks = function(float) {
      var d = new Date(`${this.getFullYear()}-1-1 00:00:00`)
      d = d.getTime() - d.getDay() * timescale.day
      return float ? (this - d) / 604800000 : Math.floor((this - d) / 604800000)
    }
    /**
     * Zeroes the time to 00:00:00:000
     * @function zeroTime
     * @return {Date} the own instance
     */
    Date.prototype.zeroTime = function() {
      this.setHours(0)
      this.setMinutes(0)
      this.setSeconds(0)
      this.setMilliseconds(0)
      return this
    }
    /**
     * Adds milliseconds to the date and returns a date Object
     * @function AddMs
     * @params {Number} milliseconds Milliseconds to be added
     * @return {Date}                The date object
     */
    Date.prototype.addMs = function(milliseconds) {
      return new Date(this.getTime() + milliseconds);
    }
    /**
     * Adds seconds to the date and returns a date Object
     * @function addSeconds
     * @params {Number} seconds Seconds to be added
     * @return {Date}           The date object
     */
    Date.prototype.addSeconds = function(seconds) {
      return new Date(this.getTime() + Date.secondsToMS(seconds));
    }
    /**
     * Adds minutes to the date and returns a date Object
     * @function addMinutes
     * @params {Number} minutes Minutes to be added
     * @return {Date}           The date object
     */
    Date.prototype.addMinutes = function(minutes) {
      return new Date(this.getTime() + Date.minutesToMS(minutes));
    }
    /**
     * Adds hours to the date and returns a date Object
     * @function addHours
     * @params {Number} hours Hours to be added
     * @return {Date}         The date object
     */
    Date.prototype.addHours = function(hours) {
      return new Date(this.getTime() + Date.hoursToMS(hours));
    }
    /**
     * Adds days to the date and returns a date Object
     * @function addDays
     * @params {Number} days Days to be added
     * @return {Date}        The date object
     */
    Date.prototype.addDays = function(days) {
      return  new Date(this.setDate(this.getDate() + days));
    }
    /**
     * Adds weeks to the date and returns a date Object
     * @function addWeeks
     * @params {Number} weeks Weeks to be added
     * @return {Date}         The date object
     */
    Date.prototype.addWeeks = function(weeks) {
      return  new Date(this.setDate(this.getDate() + (weeks * 7)));
    }
    /**
     * Adds milliseconds to the date and returns a date Object
     * @function subMs
     * @params {Number} milliseconds Milliseconds to be added
     * @return {Date}                The date object
     */
    Date.prototype.subMs = function(milliseconds) {
      return new Date(this.getTime() - milliseconds);
    }
    /**
     * Adds seconds to the date and returns a date Object
     * @function subSeconds
     * @params {Number} seconds Seconds to be added
     * @return {Date}           The date object
     */
    Date.prototype.subSeconds = function(seconds) {
      return new Date(this.getTime() - Date.secondsToMS(seconds));
    }
    /**
     * Adds minutes to the date and returns a date Object
     * @function subMinutes
     * @params {Number} minutes Minutes to be added
     * @return {Date}           The date object
     */
    Date.prototype.subMinutes = function(minutes) {
      return new Date(this.getTime() - Date.minutesToMS(minutes));
    }
    /**
     * Adds hours to the date and returns a date Object
     * @function subHours
     * @params {Number} hours Hours to be added
     * @return {Date}         The date object
     */
    Date.prototype.subHours = function(hours) {
      return new Date(this.getTime() - Date.hoursToMS(hours));
    }
    /**
     * Adds days to the date and returns a date Object
     * @function subDays
     * @params {Number} days Days to be added
     * @return {Date}        The date object
     */
    Date.prototype.subDays = function(days) {
      return new Date(this.setDate(this.getDate() - days));
    }
    /**
     * Adds weeks to the date and returns a date Object
     * @function subWeeks
     * @params {Number} weeks Weeks to be added
     * @return {Date}         The date object
     */
    Date.prototype.subWeeks = function(weeks) {
      return new Date(this.setDate(this.getDate() - (weeks * 7)));
    }
  }

  if (window.HTMLElement && window.HTMLElement.prototype) {
    /**
     * HTML Element Prototype Extension
     * @module AeyosExtension/HTMLElement
     */

    /**
     * Adds a class to the element
     * @function addClass
     * @param {String} className The name of the class
     */
    HTMLElement.prototype.addClass = function(className) {
      var classes = this.className.split(' ').removeEmpty()
      classes.push(className)
      this.className = classes.join(' ')
    }
    /**
     * Removes a class from the element
     * @function removeClass
     * @param  {String} className The name of the class
     */
    HTMLElement.prototype.removeClass = function(className) {
      var classes = this.className.split(' ').removeEmpty()
      var index = classes.indexOf(className)
      if (~index) {
        classes.splice(index, 1)
      }
      this.className = classes.join(' ')
    }
  }

  if (window.Math) {
    /**
     * Math Prototype Extension
     * @module AeyosExtension/Math
     */

    /**
     * Gets the angle of a line compared to the x-axis (clockwise)
     * @function lineAngle
     * @param  {Number} x1    X position of the point 1
     * @param  {Number} y1    Y position of the point 1
     * @param  {Number} x2    X position of the point 2
     * @param  {Number} y2    Y position of the point 2
     * @param  {Boolean} inRad Wheter the angle should be returned in radians or degrees
     * @return {Number}       The angle
     */
    Math.lineAngle = function (x1, y1, x2, y2, inRad) {
      var res = Math.atan2(x2 - x1, y2 - y1) + 1.5 * Math.PI
      return inRad ? res % (2 * Math.PI) : Math.toDeg(res) % 360
    }
    /**
     * Pivots a line around a point
     * @function pivot
     * @param {Number} x        X position of the end of the line
     * @param {Number} y        Y position of the end of the line
     * @param {Number=} offsetX X position of the offset (0 otherwise)
     * @param {Number=} offsetY Y position of the offset (0 otherwise)
     * @param {Number} Angle    The angle in degrees at which to rotate
     * @retunr {Object}         Object containing the x, y position of the point
     */
    Math.pivot = function() {
      var point, angle
      if (arguments.length > 3) {
        angle = -Math.toRad(arguments[4] % 360)
        point = {
          x: arguments[2] - arguments[0],
          y: arguments[3] - arguments[1],
        }
      } else {
        angle = -Math.toRad(arguments[2] % 360)
        point = { x: arguments[0], y: arguments[1] }
      }

      var x = point.x
      var y = point.y
      var s = Math.sin(angle)
      var c = Math.cos(angle)
      point.x = x * c - y * s
      point.y = x * s + y * c
      point.x = Math.abs(point.x) < 1e-10 ? 0 : point.x
      point.y = Math.abs(point.y) < 1e-10 ? 0 : point.y
      return point
    }
    /**
     * Converts angle to degrees
     * @function toDeg
     * @param  {Number} Radians The angle in radians
     * @return {Number}         The angle in degrees
     */
    Math.toDeg = function(rad) {
      return rad * 180 / Math.PI
    }
    /**
     * Converts angle to radians
     * @function toRad
     * @param  {Number} Degrees The angle in degrees
     * @return {Number}         The angle in radians
     */
    Math.toRad = function(deg) {
      return deg / 180 * Math.PI
    }
  }

  if (window.NodeList && window.NodeList.prototype) {
    /**
     * NodeList Prototype Extension
     * @module AeyosExtension/NodeList
     */

    /**
     * Loops through the list of nodes like Array.forEach
     * @function forEach
     * @param  {Function} fn Function to be called for every element
     */
    NodeList.prototype.forEach = function(fn) {
      for (var i = 0 ; i < this.length ; i++) {
        fn.call(null, this[i], i , this)
      }
    }
    /**
     * Converts NodeList into an Array
     * @function toArray
     * @return {Array} The array containing the elements of the NodeList
     */
    NodeList.prototype.toArray = function() {
      return Array.from(this)
    }
  }
}
