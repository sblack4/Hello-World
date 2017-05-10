

interface IDatum {
    AccountCode: string
    Call_ID: number
    CallDate: number
    CallTime: number
    CallType: number
    Duration: number
    Excluded: string | boolean
    ExtNum: number
    Hours_inSeconds: number
    IntNum: number
    Location ?: string
    Min_inSeconds : number
    Organization_ID: number 
    RelationCompany ?: string
    RelationName ?: string
    RelationTable ?: string
    Relation_ID ?: number
    SecSinceMidnightBEGIN: number
    SecSinceMidnightEND: number
    TeamName: string
    Team_ID: number
    Time_Stamp: any
    Time_Stamp_End: any
    Trunk: string | number
    User_ID: number
}

interface IData {
    Data: Array<IData>
}

export { IDatum, IData };