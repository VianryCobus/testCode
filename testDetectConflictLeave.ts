class TestDetectConflictLeave {
    conflictDetection (data: {
        existingLeaveArr: Array<{
            duration: number,
            leaveDate: string,
            backToWork: string
        }>,
        leaveCreateDto: {
            duration: number,
            leaveDate: string,
            backToWork: string
        },
    }){
        let existingLeaveDuration: number = 0;
        let isExistingLeaveDurationFloat: boolean = false;
        let existingLeaveLeaveDateMillis: number = 0;
        let existingLeaveBackToWorkMillis: number = 0;
        const countData: number = data.existingLeaveArr.length;

        existingLeaveDuration = data.existingLeaveArr[countData - 1].duration;
        isExistingLeaveDurationFloat = this.isFloat(Number(existingLeaveDuration))
        existingLeaveLeaveDateMillis = new Date(data.existingLeaveArr[countData - 1].leaveDate).getTime();
        existingLeaveBackToWorkMillis = new Date(data.existingLeaveArr[countData - 1].backToWork).getTime();

        const dtoBackToWorkMillis: number = new Date(String(data.leaveCreateDto.backToWork)).getTime();
        const dtoLeaveDateMillis: number = new Date(String(data.leaveCreateDto.leaveDate)).getTime();
        const isDurationFloat: boolean = this.isFloat(Number(data.leaveCreateDto.duration))
        // case for same day
        if (
            dtoLeaveDateMillis == existingLeaveLeaveDateMillis &&
            dtoBackToWorkMillis == existingLeaveBackToWorkMillis &&
            isDurationFloat && isExistingLeaveDurationFloat
        ) {
            let sumExistingLeaveDuration: number = 0
            sumExistingLeaveDuration = data.existingLeaveArr.reduce((acc, curr) => acc + curr.duration, 0);
            const totalWithRequest: number = sumExistingLeaveDuration + Number(data.leaveCreateDto.duration)
            console.log(`totalWithRequest`, totalWithRequest)
            if (totalWithRequest > 1) {
                return true;
            }
        } else if (dtoLeaveDateMillis === existingLeaveBackToWorkMillis) {
            console.log({
                dtoLeaveDateMillis,
                existingLeaveBackToWorkMillis
            })
            // if existing leave duration is float, then back to work day should have 0.5 decimal point
            if (
                isExistingLeaveDurationFloat &&
                Number(data.leaveCreateDto.duration) > 0.5) 
            {
                return true;
            }
        }
        return false;
    }

    isFloat(
        sample: number
    ): boolean {
        return Number(sample) === sample && !Number.isInteger(sample);
    }
}

let detect = false;
// let classex = new TestDetectConflictLeave();
// // CASE 1
// detect = classex.conflictDetection({
//     existingLeaveArr: [
//         {
//             duration: 0.5,
//             leaveDate: '2025-01-01',
//             backToWork: '2025-01-01',
//         },
//         {
//             duration: 0.5,
//             leaveDate: '2025-01-01',
//             backToWork: '2025-01-01',
//         },
//     ],
//     leaveCreateDto: {
//         duration: 0.5,
//         leaveDate: '2025-01-01',
//         backToWork: '2025-01-01',
//     }
// })
// if (detect){
//     console.log(`CASE 1 OVERLAP!!!`)
// }

// // CASE 2
// let classex = new TestDetectConflictLeave();
// detect = classex.conflictDetection({
//     existingLeaveArr: [
//         {
//             duration: 1.5,
//             leaveDate: '2025-01-01',
//             backToWork: '2025-01-02',
//         },
//     ],
//     leaveCreateDto: {
//         duration: 1,
//         leaveDate: '2025-01-02',
//         backToWork: '2025-01-03',
//     }
// })
// if (detect){
//     console.log(`CASE 2 OVERLAP!!!`)
// }

// // CASE 3
// let classex = new TestDetectConflictLeave();
// detect = classex.conflictDetection({
//     existingLeaveArr: [
//         {
//             duration: 1.5,
//             leaveDate: '2025-01-01',
//             backToWork: '2025-01-02',
//         },
//         {
//             duration: 0.5,
//             leaveDate: '2025-01-02',
//             backToWork: '2025-01-02',
//         },
//     ],
//     leaveCreateDto: {
//         duration: 0.5,
//         leaveDate: '2025-01-02',
//         backToWork: '2025-01-02',
//     }
// })
// if (detect){
//     console.log(`CASE 2 OVERLAP!!!`)
// }