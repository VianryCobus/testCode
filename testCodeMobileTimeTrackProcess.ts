type autoTimetrackType = {
  _id: string,
  timeTrackingId: string,
  autoStop: number,
  lastScreenshotMobile: number,
  createdBy: string,
  updatedBy: string,
  createdAt: string,
  updatedAt: string,
}

type existingTimetrackType = {
  _id: string,
  startTime: string,
  endTime: string,
  duration: number,
  userId: any,
  projectId: string,
  taskId: string,
  companyId: string,
  status: string | "start" | "in_progress" | "offline" | "stop",
  device: string,
  createdBy: string,
  updatedBy: string,
  isDeleted: string | Date,
  timeManualStatus: string | "Pending" | "Approve" | "Reject",
  createdAt: string | Date,
  updatedAt: string | Date,
}

type actionType = {
  status: boolean,
  message: string,
  action: string,
  data: {
    timetrackId: string | number,
    userId?: string | number,
    actionData?: any,
  },
}

class MobileTimeTracker {
  async prepareDataAutomateTimetrack(){
    try {
      // GET DATA TABLE AUTO TIMETRACK
      const getTableAutoTimetrack: any = () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve([{
              _id: "67d78f68475c6b5209c50b5a",
              timeTrackingId: "67d78f68475c6b5209c50b55",
              lastScreenshotMobile: new Date().getTime(),
              autoStop: 3600000,
              createdBy: "666950b7aac74a4f192fbb92",
              updatedBy: "666950b7aac74a4f192fbb92",
              createdAt: "2025-03-17T02:56:40.834+00:00",
              updatedAt: "2025-03-17T02:56:40.834+00:00"
            }])
          }, 5000)
        })
      }
      // GET DATA TABLE EXISTING TIMETRACK
      const getTableExistingTimetrack: any = () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve([{
              _id: "67d78f68475c6b5209c50b55",
              startTime: "2025-03-17T02:56:40.423+00:00",
              endTime: "2025-03-17T02:56:40.423+00:00",
              duration: 0,
              userId: {
                _id: "666950b7aac74a4f192fbb92",
                name: "Cobus",
                email: "xoxin93809@fna6.com",
                emailEmployee: "xoxin93809@fna6.com",
                salaryCurrency: "IDR",
                country: "Indonesia",
                phone: "628515429721",
                employmentStatus: "full_time",
                lastScreenshot: 150000,
                minuteRandomScreenshot: 1,
              },
              projectId: "666950b8aac74a4f192fbb99",
              taskId: "666950b7aac74a4f192fbb95",
              companyId: "666950b7aac74a4f192fbb97",
              status: "start",
              device: "mobile",
              createdBy: "666950b7aac74a4f192fbb92",
              updatedBy: "666950b7aac74a4f192fbb92",
              isDeleted: null,
              timeManualStatus: "Pending",
              createdAt: "2025-03-17T02:56:40.573+00:00",
              updatedAt: "2025-03-17T02:56:40.573+00:00",
            }])
          }, 5000)
        })
      }
      let dataTableAutoTimetrack = await getTableAutoTimetrack()
      let dataTableExistingTimetrack = await getTableExistingTimetrack()
      console.log({
        message: 'before process',
        dataTableAutoTimetrack,
        dataTableExistingTimetrack,
      })
      const responseLogic = this.automateTimetrack(
        dataTableAutoTimetrack, 
        dataTableExistingTimetrack
      )
      console.log(responseLogic)
      // IF ACTION DELETE
      dataTableAutoTimetrack = dataTableAutoTimetrack.filter(
        (es: autoTimetrackType) => !responseLogic.existingTimetrackActionDelete?.map(e => e.data)?.map(e => e.timetrackId).includes(es?.timeTrackingId)
      )
      // IF ACTION UPDATE
      const mapDataTableExistingTimetrack = responseLogic.existingTimetrackActionUpdate?.map(e => e.data)
      if (mapDataTableExistingTimetrack) {
        for (const p of mapDataTableExistingTimetrack) {
          const selectDataTableExistingTimetrack: existingTimetrackType = dataTableExistingTimetrack.find(
            (es: existingTimetrackType) => es?._id === p?.timetrackId
          )
          selectDataTableExistingTimetrack.endTime = p?.actionData?.endTime
          selectDataTableExistingTimetrack.status = p?.actionData?.status
          selectDataTableExistingTimetrack.duration = p?.actionData?.duration
        }
      }
      // IF ACTION INSERT
      console.log(`INSERT SCREENSHOT DATA`)

      console.log({
        message: 'after process',
        dataTableAutoTimetrack,
        dataTableExistingTimetrack,
      })
      return {
        message: 'Process Mobile time track done',
      }
    } catch (error) {
      return error;
    }
  }
  
  automateTimetrack (
    dataTableAutoTimetrack: Array<autoTimetrackType>, 
    dataTableExistingTimetrack: Array<existingTimetrackType>,
  ){
    const minuteIntervalMobileScreenshot: number = 15;
    const nowTimeMillis: number = new Date().getTime();
    // check if automate timetrack data is exist
    if (dataTableAutoTimetrack.length < 1) {
      return {
        status: false,
        message: 'There is no queue autotimetrack',
      }
    }
    const existingTimetrackActionDelete: Array<actionType> = [];
    const existingTimetrackActionUpdate: Array<actionType> = [];
    const existingTimetrackActionInsert: Array<actionType> = [];
    // first step is check is check time track id on automate data is truly exist at existing time track data
    for (const autoData of dataTableAutoTimetrack) {
      // Select timetrack data based on time tracking id that saved in automate table
      const SelectDataExist = dataTableExistingTimetrack.find((e: existingTimetrackType) => e._id === autoData?.timeTrackingId)
      // check if exist
      if (SelectDataExist) {
        // guard if data existing time track is stop
        if (SelectDataExist?.status === 'stop'){
          // delete auto timetracking data for action instructions
          existingTimetrackActionDelete.push({
            status: false,
            message: 'Timetracking Data was no longer active',
            action: 'DELETE',
            data: {
              timetrackId: autoData?.timeTrackingId,
            },
          })
          break;
        }
        // check if autoStop already set
        if (autoData?.autoStop) {
          const shouldStop: boolean = (nowTimeMillis - new Date(autoData?.createdAt).getTime()) >= autoData?.autoStop
          if (shouldStop) {
            // update to stop existing time tracking
            existingTimetrackActionUpdate.push({
              status: true,
              message: 'Update endTime and status by CRONJOB',
              action: 'UPDATE',
              data: {
                timetrackId: autoData?.timeTrackingId,
                actionData: {
                  endTime: new Date(nowTimeMillis).toISOString(),
                  status: 'stop',
                  duration: nowTimeMillis - new Date(SelectDataExist?.startTime).getTime()
                }
              }
            })
            // delete auto timetracking data for action instructions
            existingTimetrackActionDelete.push({
              status: false,
              message: 'Timetracking Data was no longer active',
              action: 'DELETE',
              data: {
                timetrackId: autoData?.timeTrackingId,
              },
            })
            break;
          }
        }
        // if all is well then continue to update ACTION
        existingTimetrackActionUpdate.push({
          status: true,
          message: 'Update endTime and status by CRONJOB',
          action: 'UPDATE',
          data: {
            timetrackId: autoData?.timeTrackingId,
            actionData: {
              endTime: new Date(nowTimeMillis).toISOString(),
              status: 'in_progress',
              duration: nowTimeMillis - new Date(SelectDataExist?.startTime).getTime()
            }
          }
        })
        // check if existing time track is from mobile device
        if (SelectDataExist?.device === 'mobile'){
          const itsTimeForScreenshot: boolean = (nowTimeMillis - autoData?.lastScreenshotMobile) >= (minuteIntervalMobileScreenshot * (60 * 1000))
          if (itsTimeForScreenshot) {
            existingTimetrackActionInsert.push({
              status: true,
              message: 'Insert mobile time screenshot by CRONJOB',
              action: 'INSERT',
              data: {
                timetrackId: autoData?.timeTrackingId,
                userId: SelectDataExist?.userId
              }
            })
          }
        }
      }
    }
    return {
      message: 'After automate timetrack',
      existingTimetrackActionDelete,
      existingTimetrackActionUpdate,
      existingTimetrackActionInsert
    }
  }
}

const runCode = new MobileTimeTracker()
runCode.prepareDataAutomateTimetrack().then((data) => {
  console.log(data)
})
