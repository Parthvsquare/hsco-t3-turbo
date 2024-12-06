export enum Services {
  weight = "bc340e9b-ea14-1fb5-d64d-726000210324",
  liter = "bc340e9b-ea14-1fb5-d64d-726000220324",
  alarm = "bc340e9b-ea14-1fb5-d64d-726000230324",
  piece = "bc340e9b-ea14-1fb5-d64d-726000240324",
  grading = "bc340e9b-ea14-1fb5-d64d-726000250324",
}

export enum WeightChar {
  weight = "bc340e9b-ea14-1fb5-d64d-726001210324",
  maxWeight = "bc340e9b-ea14-1fb5-d64d-726002210324",
  accuracy = "bc340e9b-ea14-1fb5-d64d-726003210324",
  currentMode = "bc340e9b-ea14-1fb5-d64d-726004210324",
  command = "bc340e9b-ea14-1fb5-d64d-726005210324",
  activeService = "bc340e9b-ea14-1fb5-d64d-726006210324",
}

export enum LiterChar {
  volume = "bc340e9b-ea14-1fb5-d64d-726001220324",
  desity = "bc340e9b-ea14-1fb5-d64d-726002220324",
}

export enum AlarmChar {
  alarmMax = "bc340e9b-ea14-1fb5-d64d-726001230324",
  alarmMin = "bc340e9b-ea14-1fb5-d64d-726002230324",
}

export enum PieceChar {
  unitPiece = "bc340e9b-ea14-1fb5-d64d-726001240324",
  noOfPiece = "bc340e9b-ea14-1fb5-d64d-726002240324",
}

export enum GradeChar {
  gradeStart = "bc340e9b-ea14-1fb5-d64d-726001250324",
  gradeStep = "bc340e9b-ea14-1fb5-d64d-726002250324",
  noOfGrade = "bc340e9b-ea14-1fb5-d64d-726003250324",
  currentGrade = "bc340e9b-ea14-1fb5-d64d-726004250324",
}

export enum SubscribePlanEnum {
  BASIC = "BASIC",
  PIECE = "PIECE",
  GRADING = "GRADING",
  ALERT = "ALERT",
}

export interface GradeSystemTemplate {
  gradeId: string;
  itemName: string;
  gradeName: string;
  gradeUpperLimit: string;
  gradeLowerLimit: string;
  makePublic: boolean;
  userId: string;
}
