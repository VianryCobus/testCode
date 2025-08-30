// enum Role {
//   ADMIN = 'admin',
//   EMPLOYEE = 'employee',
//   HR = 'hr',
//   MANAGER = 'manager',
//   // OWNER = 'owner', //replaced with super admin
//   SUPER_ADMIN = 'super admin',
// }


interface JwtDataInterface {
  _id?: string;
  name?: string;
  position?: string;
  phone?: string;
  email?: string;
  emailEmployee?: string;
  address?: string;
  roles?: any;
  photoLink?: string;
  company?: string;
  isFirstLogin?: boolean;
  employmentStatus?: string;
  subscription?: string;
  customerId?: string;
  isAllowScreenshot?: boolean;
  isAllowAiChat?: boolean;
  isAllowAiClassification?: boolean;
  isShowAutoGiftAi?: boolean;
  isActiveAiFreeTrial?: boolean;
  iat?: number;
  exp?: number;
}

// enum TimeManualStatus {
//   PENDING = 'Pending',
//   APPROVED = 'Approved',
//   REJECTED = 'Rejected',
// }

// enum TimetrackingStatus {
//   start = 'start',
//   in_progress = 'in_progress',
//   stop = 'stop',
//   offline = 'offline',
// }

// enum TimetrackingDevice {
//   web = 'web',
//   mobile = 'mobile',
//   manual = 'manual'
// }

class TimeTrackingCreateDto {
  startTime?: string | number | Date;

  endTime?: string | number | Date;

  duration?: number;

  userId?: string;

  projectId?: string;

  taskId?: string;

  companyId?: string;

  status: any;

  device?: any;

  manualReason?: string;

  lastScreenshot?: number | string;

  minuteRandomScreenshot?: number | string;

  date?: string

  gmt?: string | number
  
  beginTimetrackFromInProgress?: boolean;

  createdBy?: string;

  updatedBy?: string;

  isDeleted?: string;

  timeManualStatus?: any;
}

// === REAL CODE
// async createTimeTracking(
// === TEST CODE
function createTimeTracking(
// ===
  timeTrackingCreateDto: TimeTrackingCreateDto,
  token: JwtDataInterface,
  latestDataOnStorage: any, // optional property only for test case
) 
  // === REAL CODE
  // : Promise<any> {
  // === TEST CODE
  : any {
  let { startTime, endTime, duration, ...restTimeTrackingCreateDto } =
    timeTrackingCreateDto;
  // let timeTracking = new this.timeTrackingModel({
  //   ...restTimeTrackingCreateDto,
  //   duration: 0,
  //   startTime: new Date().getTime(),
  //   endTime: new Date().getTime(),
  //   createdBy: token?._id,
  //   updatedBy: token?._id,
  // });
  let response: any;
  let dataAction: any;
  let updateUser = null;
  let dataActionStop: any;
  let latestData: any;
  let gap: any;
  let filter: any;
  try {
    // === REAL CODE
    // filter = {
    //   userId: timeTrackingCreateDto.userId,
    //   status: {
    //     $in: ['start', 'in_progress', 'offline'],
    //   },
    //   // === TODO : old logic
    //   // taskId: timeTrackingCreateDto.taskId,
    //   // projectId: timeTrackingCreateDto.projectId,
    // };
    // latestData = await this.timeTrackingModel.findOne(filter).sort({
    //   startTime: 'desc',
    // });
    // === TEST CODE
    latestData = latestDataOnStorage.find((x: any) => ['start', 'in_progress', 'stop'].includes(x?.status) && x?.userId === token?._id);
    // ===
    if (timeTrackingCreateDto.device === 'manual') {
      const payloadCreateWithPersonAction = {
        ...timeTrackingCreateDto,
        createdBy: !timeTrackingCreateDto?.createdBy ? token?._id : timeTrackingCreateDto?.createdBy,
        updatedBy: !timeTrackingCreateDto?.updatedBy ? token?._id : timeTrackingCreateDto?.updatedBy
      } 
      // === REAL CODE
      // timeTracking = new this.timeTrackingModel(payloadCreateWithPersonAction);
      // dataAction = await timeTracking.save();
      // this.payrollRepository.updateUserPayrollContinously(timeTrackingCreateDto.userId);
      // if (dataAction) {
      //   response = {
      //     status: true,
      //     data: dataAction,
      //     statusCode: 201,
      //     message: 'Times Updated',
      //     timeServer: new Date().getTime(),
      //     forceScreenshot: false
      //   };
      // }
      // === TEST CODE
      response = {
        status: true,
        desc: "saved manual TIME"
      }
      // ===
    } else {
      if (timeTrackingCreateDto.status === 'start') {
        const lastBeginTimeTrack: number = new Date().getTime();
        if (latestData != null) {
          if (
            String(latestData.projectId) == String(timeTrackingCreateDto.projectId) && 
            String(latestData.taskId) == String(timeTrackingCreateDto.taskId) &&
            String(latestData?.device).toLowerCase() === String(timeTrackingCreateDto?.device).toLowerCase()
          ){
            // === REAL CODE
            // dataAction = await this.timeTrackingModel.findOneAndUpdate({ _id : latestData._id },{
            //   // === TODO : old logic
            //   // duration: (latestData.duration + (new Date().getTime() - latestData.endTime)),
            //   duration: new Date().getTime() - latestData.startTime,
            //   endTime: new Date().getTime(),
            //   status: 'in_progress',
            //   offlineTime: null,
            //   updatedBy: token?._id,
            // },
            // { 
            //   new: true,
            // });
            // === TEST CODE
            latestData.status = 'in_progress';
          } else {
            // === REAL CODE
            // // when new time track data is have different task or project with latest data, first step is make stop the latest one
            // dataActionStop = await this.timeTrackingModel.findOneAndUpdate({ _id : latestData._id },{
            //   duration: new Date().getTime() - latestData.startTime,
            //   endTime: new Date().getTime(),
            //   status: 'stop',
            //   offlineTime: null,
            //   updatedBy: token?._id,
            // },
            // { 
            //   new: true,
            // });
            // === TEST CODE
            latestData.status = 'stop';
            // the second step is create new one with new project and task
            // === REAL CODE
            // dataAction = await timeTracking.save();
            // === TEST CODE
            latestDataOnStorage.push({
              status: 'start',
              projectId: timeTrackingCreateDto.projectId,
              taskId: timeTrackingCreateDto.taskId,
              device: timeTrackingCreateDto?.device,
              userId: token?._id,
            })
          }
        } else {
          // === REAL CODE
          // dataAction = await timeTracking.save();
          // === TEST CODE
          latestDataOnStorage.push({
            status: 'start',
            projectId: timeTrackingCreateDto.projectId,
            taskId: timeTrackingCreateDto.taskId,
            device: timeTrackingCreateDto?.device,
            userId: token?._id,
          })
        }
        // === REAL CODE
        // this.soloquestService.onUserStartWork( this.timeTrackingModel, timeTrackingCreateDto.userId );

        // updateUser = await this.userModel.updateOne({
        //   _id: timeTrackingCreateDto.userId
        // }, {
        //   lastScreenshot: timeTrackingCreateDto?.lastScreenshot,
        //   minuteRandomScreenshot: timeTrackingCreateDto?.minuteRandomScreenshot,
        //   lastBeginTimeTrack
        // })

        // if (dataAction && updateUser) {
        //   await this.userService.updatePlaying(
        //     timeTrackingCreateDto.userId.toString(),
        //     true,
        //   );
        //   const totalWorkingData = await this.totalWorkingToday(
        //     String(timeTrackingCreateDto.userId), 
        //     timeTrackingCreateDto.date, 
        //     String(timeTrackingCreateDto.gmt)
        //   )
        //   response = {
        //     status: true,
        //     data: dataAction,
        //     statusCode: 201,
        //     message: 'Times Updated',
        //     timeServer: new Date().getTime(),
        //     forceScreenshot: false,
        //     lastScreenshot: totalWorkingData?.data?.lastScreenshot,
        //     minuteRandomScreenshot: totalWorkingData?.data?.minuteRandomScreenshot,
        //     lastBeginTimeTrack
        //   };
        // }
        response = {
          status: true,
          desc: "saved TIME"
        }
      } else if (
        ['in_progress', 'stop'].includes(timeTrackingCreateDto.status)
      ) {
        // === REAL CODE
        // const userData: User = await this.userModel.findOne({
        //   _id: timeTrackingCreateDto?.userId
        // });
        // let lastBeginTimeTrack: Number = Number(userData?.lastBeginTimeTrack);
        if (
          latestData != null &&
          String(latestData?.projectId) ==
          String(timeTrackingCreateDto.projectId) &&
          String(latestData?.taskId) == String(timeTrackingCreateDto.taskId) &&
          String(latestData?.device).toLowerCase() === String(timeTrackingCreateDto.device).toLowerCase()
        ) {
          // === REAL CODE
          // dataAction = await this.timeTrackingModel.findOneAndUpdate({ _id : latestData._id },{
          //   // === TODO : old logic
          //   // duration: (latestData.duration + (new Date().getTime() - latestData.endTime)),
          //   duration: new Date().getTime() - latestData.startTime,
          //   endTime: new Date().getTime(),
          //   status: timeTrackingCreateDto.status,
          //   offlineTime: null,
          //   updatedBy: token?._id,
          // },
          // { 
          //   new: true,
          // });
          // === TEST CODE
          latestData.status = timeTrackingCreateDto.status;

          // // append.
          // this.soloquestService.onUserUpdateWork(this.timeTrackingModel, timeTrackingCreateDto.userId);
        } else {
          // === REAL CODE
          // response = {
          //   status: true,
          //   data: "there's no data found",
          //   statusCode: 404,
          //   message: "there's no data found",
          //   timeServer: new Date().getTime(),
          //   forceScreenshot: false,
          //   lastBeginTimeTrack,
          // };
          // === TEST CODE
          response = {
            status: false,
            desc: "there's no data found",
          }
          return {
            ...response,
            latestDataOnStorage,
          };
        }
        // === REAL CODE
        // let objectUpdateUser = {
        //   lastScreenshot: timeTrackingCreateDto?.lastScreenshot,
        //   minuteRandomScreenshot: timeTrackingCreateDto?.minuteRandomScreenshot,
        // }
        // if (timeTrackingCreateDto?.beginTimetrackFromInProgress) {
        //   lastBeginTimeTrack = new Date().getTime(); 
        //   objectUpdateUser['lastBeginTimeTrack'] = lastBeginTimeTrack; 
        // }
        // updateUser = await this.userModel.updateOne({
        //   _id: timeTrackingCreateDto.userId
        // }, objectUpdateUser)

        // if (dataAction && latestData != null) {
        //   const totalWorkingVar: number = await this.totalWorkingTodayOnly(
        //     String(timeTrackingCreateDto.userId), 
        //     timeTrackingCreateDto.date, 
        //     timeTrackingCreateDto.gmt
        //   )
        //   const forceScreenshot: boolean = totalWorkingVar > (
        //     (
        //       latestData?.lastScreenshot || 0
        //     ) + (
        //       (
        //         Number(
        //           process.env.DEFAULT_TIMETRACK_MINUTE_RANDOM
        //         ) || this.DEFAULT_TIMETRACK_MINUTE_RANDOM
        //       ) * 60000
        //     )
        //   )
        //   await this.userService.updatePlaying(
        //     timeTrackingCreateDto.userId.toString(),
        //     true,
        //   );
        //   if(timeTrackingCreateDto.status === 'stop') this.payrollRepository.updateUserPayrollContinously(timeTrackingCreateDto.userId);
        //   response = {
        //     status: true,
        //     data: dataAction,
        //     statusCode: 201,
        //     message: 'Times Updated',
        //     timeServer: new Date().getTime(),
        //     // forceScreenshot,
        //     forceScreenshot: false,
        //     lastScreenshot: totalWorkingVar,
        //     minuteRandomScreenshot: 15,
        //     lastBeginTimeTrack
        //   };
        // }
        // === TEST CODE
        response = {
          status: true,
          desc: "saved TIME",
        }
      }
    }
    // if (dataAction) {
    //   const userId = String(restTimeTrackingCreateDto.userId)
    //   const companyId = String(restTimeTrackingCreateDto.companyId)
    //   await this.questService.firstQuestProgressPerUser(userId, companyId);
    //   await this.questService.secondQuestProgressPerUser(userId, companyId);
    // }
    return {
      ...response,
      latestDataOnStorage,
    };
  } catch (error) {
    console.log(error);
    // === REAL CODE
    // throw new BadRequestException();
  }
}



// ============= TEST CASE !!!!!!!!!!!!!!!!!!
console.log(`============= TEST CASE 1 MOBILE INTERCEPT WEB IN PROGRES`)
const tokens: JwtDataInterface = {
  _id: "aaa",
}

const input1: TimeTrackingCreateDto = {
  status: 'start',
  projectId: "aaa",
  taskId: "aaa",
  device: 'mobile',
}

const existingData = [{
  userId: "aaa",
  status: 'in_progress',
  projectId: "aaa",
  taskId: "aaa",
  device: 'web',
}]
console.log(`existingData`, existingData)
console.log(createTimeTracking(
  input1,
  tokens,
  existingData
))

console.log(`============= TEST CASE 2 WEB INTERCEPT MOBILE IN PROGRES`)
const input2: TimeTrackingCreateDto = {
  status: 'start',
  projectId: "aaa",
  taskId: "aaa",
  device: 'web',
}

const existingData2 = [{
  userId: "aaa",
  status: 'in_progress',
  projectId: "aaa",
  taskId: "aaa",
  device: 'mobile',
}]
console.log(`existingData2`, existingData2)
console.log(createTimeTracking(
  input2,
  tokens,
  existingData2
))


console.log(`============= TEST CASE 3 MOBILE IN PROGRESS INTERCEPT WEB IN PROGRES`)

const input3: TimeTrackingCreateDto = {
  status: 'in_progress',
  projectId: "aaa",
  taskId: "aaa",
  device: 'mobile',
}

const existingData3 = [{
  userId: "aaa",
  status: 'in_progress',
  projectId: "aaa",
  taskId: "aaa",
  device: 'web',
}]
console.log(`existingData3`, existingData3)
console.log(createTimeTracking(
  input3,
  tokens,
  existingData3
))


console.log(`============= TEST CASE 4 MOBILE STOP INTERCEPT WEB IN PROGRES`)

const input4: TimeTrackingCreateDto = {
  status: 'stop',
  projectId: "aaa",
  taskId: "aaa",
  device: 'mobile',
}

const existingData4 = [{
  userId: "aaa",
  status: 'in_progress',
  projectId: "aaa",
  taskId: "aaa",
  device: 'web',
}]
console.log(`existingData4`, existingData4)
console.log(createTimeTracking(
  input4,
  tokens,
  existingData4
))