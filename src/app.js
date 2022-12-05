/**
 * @file Manages the configuration of NASA Open MCT.
 * @author Marcelo Arias
 */

 openmct.setAssetPath("node_modules/openmct/dist");
 openmct.install(openmct.plugins.LocalStorage());
 openmct.install(openmct.plugins.MyItems());
 openmct.install(openmct.plugins.UTCTimeSystem());

 const ONE_HOUR = 60 * 60 * 1000;
 let now = Date.now();
 openmct.time.clock("local", { start: -15 * 60 * 1000, end: 0 });
 openmct.time.timeSystem("utc");
 openmct.install(openmct.plugins.Espresso());

 openmct.install(openmct.plugins.PlanLayout());
 openmct.install(openmct.plugins.DisplayLayout({
            showAsView: ['summary-widget', 'example.imagery']
 }));

openmct.install(Graphem({
  namespace: "example.taxonomy",
  key: "spacecraft",
  dictionaryPath: "/dictionary.json",
  telemetryName: "example.telemetry",
  subscriptionName: "formatted",
  urn: "localhost:4000/graphql",
}));


openmct.start();
