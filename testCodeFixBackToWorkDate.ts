type UserDateLeave = {
  idLeave: string;
  idUser: string;
  leaveType: string;
  startLeaveDate: Date;
  backToWorkDate: Date;
  numberEachLeaveDate: number;
  stringEachLeaveDate: string;
}

class FixBackToWork {
  constructor(){}
  public formatDate(
    date: string,
    gmt: number | string = 0,
  ): {
    text: string;
    number: string;
    strAmpm: string;
    millisecond: number;
  } {
    // get month name
    const monthNames: {
      monthAbbr: string;
      month: string;
    }[] = [
        { monthAbbr: 'Jan', month: 'January' },
        { monthAbbr: 'Feb', month: 'Feburary' },
        { monthAbbr: 'Mar', month: 'March' },
        { monthAbbr: 'Apr', month: 'April' },
        { monthAbbr: 'May', month: 'May' },
        { monthAbbr: 'Jun', month: 'June' },
        { monthAbbr: 'Jul', month: 'July' },
        { monthAbbr: 'Aug', month: 'August' },
        { monthAbbr: 'Sep', month: 'September' },
        { monthAbbr: 'Oct', month: 'October' },
        { monthAbbr: 'Nov', month: 'November' },
        { monthAbbr: 'Dec', month: 'December' },
      ];

    // get day name
    const arrDay: Array<any> = [
      { dayAbbr: 'Sun', day: 'Sunday' },
      { dayAbbr: 'Mon', day: 'Monday' },
      { dayAbbr: 'Tue', day: 'Tuesday' },
      { dayAbbr: 'Wed', day: 'Wednesday' },
      { dayAbbr: 'Thu', day: 'Thursday' },
      { dayAbbr: 'Fri', day: 'Friday' },
      { dayAbbr: 'Sat', day: 'Saturday' },
    ];

    const gmtIsLowerThanZero = Number(gmt) < 0;
    let dateAdjustGmt: number =
      new Date(date).getTime() + Number(gmt) * 3600 * 1000;
    if (gmtIsLowerThanZero) {
      dateAdjustGmt = new Date(date).getTime() - Math.abs(Number(gmt)) * 3600 * 1000;
    }
    let monthForNumber: number = new Date(dateAdjustGmt).getUTCMonth() + 1;
    const monthDoubleDigit: string | number =
      monthForNumber < 10 ? `0${monthForNumber}` : monthForNumber;
    const dateDoubleDigit: string | number =
      new Date(dateAdjustGmt).getUTCDate() < 10
        ? `0${new Date(dateAdjustGmt).getUTCDate()}`
        : new Date(dateAdjustGmt).getUTCDate();
    const day: string = arrDay[new Date(dateAdjustGmt).getUTCDay()].dayAbbr;
    // compose text format ex: Fri, January 6 2023
    const text: string = `${day}, ${monthNames[new Date(dateAdjustGmt).getUTCMonth()].monthAbbr
      } ${new Date(dateAdjustGmt).getUTCDate()} ${new Date(
        dateAdjustGmt,
      ).getUTCFullYear()}`;
    // compose text format ex: 2023-01-06
    const number: string = `${new Date(
      dateAdjustGmt,
    ).getUTCFullYear()}-${monthDoubleDigit}-${dateDoubleDigit}`;
    // compose text format ex: 8:00 AM
    let hoursLocal: number = new Date(date).getUTCHours();
    let minutes: number | string = new Date(date).getUTCMinutes();
    let ampm: string = hoursLocal >= 12 ? 'PM' : 'AM';
    hoursLocal = hoursLocal % 12;
    hoursLocal = hoursLocal ? hoursLocal : 12;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    const strAmpm: string = `${hoursLocal}:${minutes} ${ampm}`;
    return {
      text,
      number,
      strAmpm,
      millisecond: dateAdjustGmt
    };
  }
  public newMapLeave(
    leaveData: Array<any>,
    gmt: string | number,
    startDayTimezoneClient: string | number,
    endDayTimezoneClient: string | number,

  ): Array<UserDateLeave> {
    let returnData: Array<UserDateLeave> = [];
    for(const i of leaveData) {
      let tempCounterDate: number = 0;
      let oneDayInMillisecond: number = 86400000;
      const isFloatNumber = this.isFloat(i?.duration);
      let deductionParams: number = isFloatNumber ? 0 : oneDayInMillisecond;
      let leaveDateNumber: string | number | Date = new Date(String(i?.leaveDate)).getTime();
      leaveDateNumber = new Date(leaveDateNumber);
      const leaveDateNumberConvertClientTimezone = this.formatDate(
        String(leaveDateNumber),
        gmt,
      );
      leaveDateNumber = new Date(`${leaveDateNumberConvertClientTimezone.number}T00:00:00.000Z`).getTime()
      let backToWorkNumber: string | number | Date = new Date(String(i?.backToWork)).getTime();
      backToWorkNumber = new Date(backToWorkNumber);
      const backToWorkNumberConvertClientTimezone = this.formatDate(
        String(backToWorkNumber),
        gmt,
      );
      backToWorkNumber = new Date(`${backToWorkNumberConvertClientTimezone.number}T00:00:00.000Z`).getTime()
      tempCounterDate = leaveDateNumber;
      while(tempCounterDate <= (backToWorkNumber - deductionParams)) {
        if (tempCounterDate >= Number(startDayTimezoneClient) && tempCounterDate <= Number(endDayTimezoneClient)){
          const formatStringEachLeaveDate = this.formatDate(
            new Date(tempCounterDate).toISOString().split('T')[0],
            gmt
          )
          returnData.push({
            idLeave: i?._id,
            idUser: String(i?.userId),
            leaveType: i?.leaveType,
            startLeaveDate: new Date(String(i?.leaveDate)),
            backToWorkDate: new Date(String(i?.backToWork)),
            numberEachLeaveDate: tempCounterDate,
            stringEachLeaveDate: formatStringEachLeaveDate.text,
          })
        }
        tempCounterDate += oneDayInMillisecond
      }
    }
    return returnData
  }
  public isFloat(
    sample: number
  ): boolean {
    return Number(sample) === sample && !Number.isInteger(sample);
  }
}

const result = new FixBackToWork().newMapLeave(
  [
    {
      _id: "66b0ce765b9b3d83d8245a08",
      submitDate: "2024-08-08T07:36:49.299Z",
      leaveType: 'Annual Leave',
      leaveDate: "2024-08-04T16:00:00.000Z",
      backToWork: "2024-08-07T16:00:00.000Z",
      userId: "666950b7aac74a4f192fbb92",
      duration: 3
    },
    {
      _id: "66cd3dafc67c1918bc68b2e8",
      submitDate: "2024-08-27T02:44:57.771Z",
      leaveType: 'Annual Leave',
      leaveDate: "2024-08-05T02:44:00.000Z",
      backToWork: "2024-08-08T02:00:44.000Z",
      userId: "666953c7aac74a4f192fbd1d",
      duration: 3
    },
    {
      _id: "672aefa1c8c242e7ec832714",
      submitDate: "2024-11-06T04:25:05.354Z",
      leaveType: 'Sick Leave',
      leaveDate: "2024-10-28T04:24:00.000Z",
      backToWork: "2024-10-31T16:24:00.000Z",
      userId: "666950b7aac74a4f192fbb92",
      duration: 3.5
    },
    {
      _id: "6880ed084ca207b941cee3b8",
      submitDate: "2025-07-23T14:09:07.788Z",
      leaveType: 'Annual Leave',
      leaveDate: "2025-07-25T00:00:00.000Z",
      backToWork: "2025-07-27T00:00:00.000Z",
      userId: "666950b7aac74a4f192fbb92",
      duration: 2
    },
    {
      _id: "688c0df14aa470fc523d00c6",
      submitDate: "2025-08-01T00:44:31.271Z",
      leaveType: 'Annual Leave',
      leaveDate: "2025-07-29T00:00:00.000Z",
      backToWork: "2025-07-31T00:00:00.000Z",
      userId: "666950b7aac74a4f192fbb92",
      duration: 2.5
    }
  ],
  7,
  1753117200000,
  1754154000000
);

console.log(result)
