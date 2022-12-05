import fs from "fs";
import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";
import getCurrentTimestamp from "./utils/getCurrentTimestamp";
import { parse } from "csv-parse";

const precision = (process.env.PRECISION || 1000) as number;
let simetralIndex: number = 0;
let horizonsData: any[] = [];

const waitUpdate = (miliseconds = precision) =>
  new Promise((res) => setTimeout(res, miliseconds));

const history: any = {};
let record: any = {};

let state: any = {
  angular_rate_of_change: undefined,
  angular_rate_of_change_linear_rate: undefined,
  illumination: undefined,
  sun_range: undefined,
  sun_range_rate: undefined,
  sun_observer_target: undefined,
  sun_observer_target_angle: undefined,
  angle_position: undefined,
  heliocentric_velocity_vector: undefined,
  observer_centered_galatic_lon: undefined,
  observer_centered_galatic_lat: undefined,
  sky_motion: undefined,
  sky_mot_pa: undefined,
  relvel_ang: undefined,
};

Object.keys(state).forEach((key) => {
  history[key] = [];
});

Object.keys(state).forEach((key) => {
  record[key] = {
    value: state[key],
    timestamp: getCurrentTimestamp(),
    id: key,
  };
});

const handleRowData = (row: any) => {
  horizonsData.push(row);
};

const handleError = (error: any) => {
  console.error(error.message);
};

fs.createReadStream("./src/data/horizon_data.csv")
  .pipe(parse({ delimiter: ",", columns: true, ltrim: true }))
  .on("data", handleRowData)
  .on("error", handleError)
  .on("end", function () {
    console.log("✅ Data processing finished");
  });

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "History",
    fields: {
      formatted: {
        args: {
          domainObjectKey: {
            type: GraphQLString,
            description: "Domain object identifier key",
          },
          start: {
            type: GraphQLString,
            description: "Start time in UNIX timestamp",
          },
          end: {
            type: GraphQLString,
            description: "End time in UNIX timestamp",
          },
        },
        type: GraphQLString,
        resolve(parent, args, context) {
          const reducedHistory = history[args.domainObjectKey].filter(
            (record: any) =>
              record.timestamp > args.start && record.timestamp < args.end
          );
          return JSON.stringify(reducedHistory);
        },
      },
    },
  }),
  subscription: new GraphQLObjectType({
    name: "Subscription",
    fields: {
      angular_rate_of_change: {
        type: GraphQLString,
        subscribe: async function* () {
          while (true) {
            yield {
              angular_rate_of_change: JSON.stringify(
                record["angular_rate_of_change"]
              ),
            };
            await waitUpdate();
          }
        },
      },
      angular_rate_of_change_linear_rate: {
        type: GraphQLString,
        subscribe: async function* () {
          while (true) {
            yield {
              angular_rate_of_change_linear_rate: JSON.stringify(
                record["angular_rate_of_change_linear_rate"]
              ),
            };
            await waitUpdate();
          }
        },
      },
      illumination: {
        type: GraphQLString,
        subscribe: async function* () {
          while (true) {
            yield { illumination: JSON.stringify(record["illumination"]) };
            await waitUpdate();
          }
        },
      },
      sun_range: {
        type: GraphQLString,
        subscribe: async function* () {
          while (true) {
            yield { sun_range: JSON.stringify(record["sun_range"]) };
            await waitUpdate();
          }
        },
      },
      sun_range_rate: {
        type: GraphQLString,
        subscribe: async function* () {
          while (true) {
            yield { sun_range_rate: JSON.stringify(record["sun_range_rate"]) };
            await waitUpdate();
          }
        },
      },
      sun_observer_target: {
        type: GraphQLString,
        subscribe: async function* () {
          while (true) {
            yield {
              sun_observer_target: JSON.stringify(
                record["sun_observer_target"]
              ),
            };
            await waitUpdate();
          }
        },
      },
      sun_observer_target_angle: {
        type: GraphQLString,
        subscribe: async function* () {
          while (true) {
            yield {
              sun_observer_target_angle: JSON.stringify(
                record["sun_observer_target_angle"]
              ),
            };
            await waitUpdate();
          }
        },
      },
      angle_position: {
        type: GraphQLString,
        subscribe: async function* () {
          while (true) {
            yield { angle_position: JSON.stringify(record["angle_position"]) };
            await waitUpdate();
          }
        },
      },
      heliocentric_velocity_vector: {
        type: GraphQLString,
        subscribe: async function* () {
          while (true) {
            yield {
              heliocentric_velocity_vector: JSON.stringify(
                record["heliocentric_velocity_vector"]
              ),
            };
            await waitUpdate();
          }
        },
      },
      observer_centered_galatic_lon: {
        type: GraphQLString,
        subscribe: async function* () {
          while (true) {
            yield {
              observer_centered_galatic_lon: JSON.stringify(
                record["observer_centered_galatic_lon"]
              ),
            };
            await waitUpdate();
          }
        },
      },
      observer_centered_galatic_lat: {
        type: GraphQLString,
        subscribe: async function* () {
          while (true) {
            yield {
              observer_centered_galatic_lat: JSON.stringify(
                record["observer_centered_galatic_lat"]
              ),
            };
            await waitUpdate();
          }
        },
      },
      sky_motion: {
        type: GraphQLString,
        subscribe: async function* () {
          while (true) {
            yield { sky_motion: JSON.stringify(record["sky_motion"]) };
            await waitUpdate();
          }
        },
      },
      sky_mot_pa: {
        type: GraphQLString,
        subscribe: async function* () {
          while (true) {
            yield { sky_mot_pa: JSON.stringify(record["sky_mot_pa"]) };
            await waitUpdate();
          }
        },
      },
      relvel_ang: {
        type: GraphQLString,
        subscribe: async function* () {
          while (true) {
            yield { relvel_ang: JSON.stringify(record["relvel_ang"]) };
            await waitUpdate();
          }
        },
      },
    },
  }),
});

setInterval(() => {
  Object.keys(state).forEach((key) => {
    record[key] = {
      value: state[key],
      timestamp: getCurrentTimestamp(),
      id: key,
    };
  });
  Object.keys(state).forEach((key) => {
    history[key].push(record[key]);
  });

  const {
    angular_rate_of_change,
    angular_rate_of_change_linear_rate,
    illumination,
    sun_range,
    sun_range_rate,
    sun_observer_target,
    sun_observer_target_angle,
    angle_position,
    heliocentric_velocity_vector,
    observer_centered_galatic_lon,
    observer_centered_galatic_lat,
    sky_motion,
    sky_mot_pa,
    relvel_ang,
  } = horizonsData[simetralIndex];

  state = {
    angular_rate_of_change,
    angular_rate_of_change_linear_rate,
    illumination,
    sun_range,
    sun_range_rate,
    sun_observer_target,
    sun_observer_target_angle,
    angle_position,
    heliocentric_velocity_vector,
    observer_centered_galatic_lon,
    observer_centered_galatic_lat,
    sky_motion,
    sky_mot_pa,
    relvel_ang,
  };

  simetralIndex++;
}, precision);
