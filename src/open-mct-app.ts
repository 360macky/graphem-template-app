import express from "express";

function OpenMCTApp() {
    const router = express.Router();
    router.use('/', express.static(__dirname + '/..'));
    return router
}

export default OpenMCTApp;
