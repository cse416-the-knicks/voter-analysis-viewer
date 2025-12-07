import { getMailBallotRejections, type MailBallotRejectionStatisticsModel } from "../../../api/client";
import { MAIL_BALLOT_REJECTION_COLUMNS, bargraphDataForMailBallotRejections } from "../dataColumns";
import { STATE_INFORMATION_VIEW_TYPE_SIMPLE } from "../dataViewConfigTypes";
import { ID_SELECTION_MAIL_BALLOT_REJECTIONS } from "./viewIds";

export default {
        [ID_SELECTION_MAIL_BALLOT_REJECTIONS]: {
        path: "mail-ballot-rejections",
        description: {
            type: STATE_INFORMATION_VIEW_TYPE_SIMPLE,
            barGraphTitle: "Mail Ballots Rejection",
            barGraphXTitle: "Rejection Reasons",
            dataColumnSet: MAIL_BALLOT_REJECTION_COLUMNS,
            barDataGenerator: bargraphDataForMailBallotRejections,
            rowDataGenerators: [getMailBallotRejections],
            ratioGenerator: (row: MailBallotRejectionStatisticsModel) => [row.rejectTotal!, row.totalBallotsByMail!]
        }
    } as StateInformationViewDataConfiguration
}