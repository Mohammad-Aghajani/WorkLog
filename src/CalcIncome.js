import moment from 'jalali-moment';

export const calcIncome = (wage, asFactor, nsFactor, start, end) => {
    /*
        6 < shift < 14 --> hourly wage
        14 < shift < 22 --> hourly wage * 1.25 --> Afternoon Shift
        22 < shift < 6 --> hourly wage * 1.5 --> Night Shift
    */

    const START = moment.unix(start).locale('fa').format('HH:mm');
    const END = moment.unix(end).locale('fa').format('HH:mm');
    
    const durFromUnix = end - start;
    // console.log('duuuuuuuration', moment.duration(durFromUnix, 'seconds').asHours());
    
    const date = moment.unix(start).format('jYYYY/jM/jD');
    const nextday = (moment.unix(start)).add(1, 'day').format('jYYYY/jM/jD');

    const time6 = moment(`${date} 06:00`, 'YYYY/M/D HH:mm').locale('fa').unix();
    const time6nextday = moment(`${nextday} 06:00`, 'YYYY/M/D HH:mm').locale('fa').unix();
    const time14 = moment(`${date} 14:00`, 'YYYY/M/D HH:mm').locale('fa').unix();
    const time14nextday = moment(`${nextday} 14:00`, 'YYYY/M/D HH:mm').locale('fa').unix();
    const time22 = moment(`${date} 22:00`, 'YYYY/M/D HH:mm').locale('fa').unix();
    // const time2400today = moment(`${date} 23:59`, 'YYYY/M/D HH:mm').locale('fa').unix();
    // const time0024nextDay = moment(`${nextday} 00:00`, 'YYYY/M/D HH:mm').locale('fa').unix();
    // console.log(time0024nextDay);

    let total = 0;
    let dur;
    let durAfternoon;
    let durNight;
    const hStart = parseInt(START.split(':')[0], 10);
    const hEnd = parseInt(END.split(':')[0], 10);
    let asf;
    let nsf;

    if (asFactor === '') {
      asf = '1';
    } else {
      asf = asFactor;
    }
    if (nsFactor === '') {
      nsf = '1';
    } else {
      nsf = nsFactor;
    }
    asf = parseFloat(asf);
    nsf = parseFloat(nsf);
    
    // console.log('asfffffff', asf);
    // console.log('nsfffff', nsf);
    
    if (6 <= hStart && hStart < 14) {
      if (hEnd >= 6 && hEnd < 14) {
        dur = calcDuration(start, end);
        total = calcHourlyWage(wage, dur);
      } else if (hEnd >= 14 && hEnd < 22) {
        dur = calcDuration(start, time14);
        total += calcHourlyWage(wage, dur);
        ///
        durAfternoon = calcDuration(time14, end);
        total += calcHourlyWage(wage, durAfternoon) * asf;
      } else {
        dur = calcDuration(start, time14);
        total += calcHourlyWage(wage, dur);
        ///
        durAfternoon = calcDuration(time14, time22);
        total += calcHourlyWage(wage, durAfternoon) * asf;
        ///
        durNight = calcDuration(time22, end);
        total += calcHourlyWage(wage, durNight) * nsf;
      }
    } else if (14 <= hStart && hStart < 22) {
      if (14 <= hEnd && hEnd < 22) {
        durAfternoon = calcDuration(start, end);
        total = calcHourlyWage(wage, durAfternoon) * asf;
      } else if (hEnd >= 22 || (hEnd < 6)) {
        durAfternoon = calcDuration(start, time22);
        total += calcHourlyWage(wage, durAfternoon) * asf;
        ///
        durNight = calcDuration(time22, end);
        total += calcHourlyWage(wage, durNight) * nsf;
      } else {
        durAfternoon = calcDuration(start, time22);
        total += calcHourlyWage(wage, durAfternoon) * asf;
        ///
        durNight = calcDuration(time22, time6nextday);
        total += calcHourlyWage(wage, durNight) * nsf;
        ///
        dur = calcDuration(time6nextday, end);
        total += calcHourlyWage(wage, dur);
      }
    } else {
      if (22 <= hEnd || hEnd < 6) {
        durNight = calcDuration(start, end);
        total = calcHourlyWage(wage, durNight) * nsf;
        // console.log('heyvaaaaaaaaaaaaaaaaaaaaan', total);
      } else if (hEnd >= 6 && hEnd < 14) {
        durNight = calcDuration(start, time6nextday);
        total += calcHourlyWage(wage, durNight) * nsf;
        ///
        dur = calcDuration(time6nextday, end);
        total += calcHourlyWage(wage, dur);
      } else {
        durNight = calcDuration(start, time6nextday);
        total += calcHourlyWage(wage, durNight) * nsf;
        ///
        dur = calcDuration(time6nextday, time14nextday);
        total += calcHourlyWage(wage, dur);
        ///
        durAfternoon = calcDuration(time14nextday, end);
        total += calcHourlyWage(wage, durAfternoon);
      }
    }
    // console.log(total);
    return Number(total.toFixed(1));
    // return total;
};

const calcHourlyWage = (wage, duration) => {
    return parseFloat(wage) * (
      parseFloat(duration.split(':')[0]) +
      (parseFloat(duration.split(':')[1]) / 60)
    );
    // (parseFloat(duration.split(':')[2]) / 3600)
};

export const calcDuration = (start, end) => {
  // const START = moment.unix(start).format('HH:mm');
  // const END = moment.unix(end).format('HH:mm');
  // let temp;

  // temp = moment.duration(
  //   moment(END, 'HH:mm')
  //   .diff(moment(START, 'HH:mm'))
  // );
  // temp = Math.floor(temp.asHours()) +
  //        moment.utc(temp.asMilliseconds()).format(':mm');
  // return temp;
  
  const fullDur = moment.duration(end - start, 'seconds');
  // console.log('FULLDURATION', fullDur);
  const hourDur = moment.duration(Math.floor(fullDur.asHours()), 'h');
  // console.log('HOURDUR', hourDur);
  const temp = fullDur.clone();
  const minute = temp.subtract(hourDur).asMinutes();
  // console.log('MINUTE', minute);
  // console.log('khodayaaaaaaaaaaaaaaaaaaaaa', `${Math.floor(fullDur.asHours())}:${Math.floor(minute)}`);
  
  return `${Math.floor(fullDur.asHours())}:${Math.floor(minute)}`;
  
};
