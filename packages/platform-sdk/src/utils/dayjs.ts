import "dayjs/plugin/advancedFormat";
import "dayjs/plugin/localizedFormat";
import "dayjs/plugin/quarterOfYear";
import "dayjs/plugin/utc";

import day from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import utc from "dayjs/plugin/utc";

day.extend(advancedFormat);
day.extend(localizedFormat);
day.extend(quarterOfYear);
day.extend(utc);

export const dayjs = day.utc;
