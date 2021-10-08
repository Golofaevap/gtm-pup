// node actions2/2regIntoElama.js

// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require("puppeteer-extra");
const fs = require("fs");
const colors = require("colors");
const validator = require("email-validator");

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const pluginProxy = require("puppeteer-extra-plugin-proxy");
const { freemem } = require("os");
const { Agent } = require("http");

puppeteer.use(StealthPlugin());

function getDirectories(path) {
    return fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path + "/" + file).isDirectory();
    });
}
// aelbertshvab@yandex.ru+#

// const USER_NAME = "rihuman1989@autorambler.ru";
const curr = require("../sessions/current.json");

function main() {
    const args = process.argv;

    if (!args[2]) {
        return console.log("EXIT\n".red, " - - ", "Please setup email".red, "email:", args[2]);
    }
    const OFFERS = {};
    // OFFERS.url = args[4];
    const USER_NAME = args[2];

    const fSessions = getDirectories("./sessions");
    console.log("Sessions: ", fSessions);
    if (!fSessions.includes(USER_NAME)) {
        console.log("User is not found!".red);
        return;
    }
    const folderPath = `./sessions/${USER_NAME}`;
    const userDataDirPath = `./sessions/${USER_NAME}/userDataDir`;
    const screenshotPath = `./sessions/${USER_NAME}/screnshots`;

    const contrainerInfo = {
        name: "Container-" + Math.round(Math.random() * 1000000),
    };

    // const proxy = `https://${credentials.proxy_lgn}:${credentials.proxy_pwd}@${credentials.proxy_ip}:${credentials.proxy_prt}`;
    // console.log(proxy);
    // puppeteer usage as normal
    puppeteer
        .launch({
            headless: false,
            userDataDir: userDataDirPath,
            // ignoreHTTPSErrors: true,
            args: [
                // `--proxy-server=${proxy}`,
                "--no-sandbox",
                "--disable-setuid-sandbox",
            ],
        })
        .then(async (browser) => {
            console.log("Creating GTM container");
            const page = await browser.newPage();
            await page.waitForTimeout(1000);

            await page.setDefaultTimeout(100000);
            await page.setDefaultNavigationTimeout(200000);
            try {
                console.log("Came to gtm....");
                await page.goto(`https://tagmanager.google.com/?pli=1#/admin/accounts/6004978696/containers/create`);

                await page.waitForTimeout(1000);

                await page.waitForSelector('input[id="1-form.container.data.name"]');
                const containerName = await page.$('input[id="1-form.container.data.name"]');
                await containerName.type(`Container-${contrainerInfo.name}`);

                const webButtonClick = await page.$('div[title="Web"]');
                await webButtonClick.click();

                await page.waitForTimeout(5000);
                const submitButtonClick = await page.$('button[type="submit"]');
                await submitButtonClick.click();

                await page.waitForTimeout(5000);
                try {
                    const closePopUp = await page.waitForSelector('div[class="gtm-close-icon touchable"]');
                    await closePopUp.click();
                } catch (error) {
                    console.log(error);
                }
                await page.waitForTimeout(2000);
                const variableListItem = await page.$(
                    'a[class="gtm-container-menu-list-item wd-open-variable-list-button md-gtm-theme"]'
                );
                await variableListItem.click();

                // TODO: добавление переменных

                const newVariable1 = await page.waitForSelector(
                    'button[data-ng-click="ctrl.openCreateSheet()"]'
                );
                await page.waitForTimeout(2000);
                await newVariable1.click();

                await page.waitForTimeout(3000);
                const varName1 = await page.$('div[data-ng-model="ctrl.variable.data.name"]');
                await varName1.click({ clickCount: 3 });
                await varName1.type("loc_physical_ms", { delay: 50 });


                const varBigButtin1 = await page.$('div[class="gtm-veditor-section-overlay"]');
                await varBigButtin1.click();

                return;
            } catch (error) {
                console.log(error);
            } finally {
                // await page.screenshot({ path: "testresult.png", fullPage: true });
                // await browser.close();
                console.log(`All done`);
            }
        });
}

main();

async function clickLaunch(page) {
    console.log("--  searcing launch link....");
    let link = await page.waitForSelector("a[href*='launch']");
    console.log("--  launch link found. click(  )....");
    await link.click();
}

async function fillTheForm(page, credentials, OFFERS) {
    const frame = page;

    async function enteringEmail(frame, credentials) {
        console.log("--  is there email field? ....");
        await frame.waitForTimeout(1000);
        await frame.waitForSelector("#InputElement__email");

        await frame.focus("#InputElement__email");
        await frame.waitForTimeout(1000);

        const inputElement = await frame.$("#InputElement__email");
        await inputElement.click({ clickCount: 3 });

        await frame.type("#InputElement__email", credentials.mail, { delay: 10 });
        console.log("--  email entered ....");

        const enteredEmail = await frame.evaluate(() => {
            const emailEl = document.getElementById("InputElement__email");
            return emailEl.value;
        });

        console.log("--  email checking ....");
        if (enteredEmail !== credentials.mail) {
            console.log("--  email checking FAILD ....");
            const emailField = await frame.waitForSelector("#InputElement__email");
            await emailField.click({ clickCount: 3 });
            emailField.type(credentials.mail);
        }
        console.log("--  email checking Complete ....");
    }

    try {
        await enteringEmail(frame, credentials);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "enteringEmail");
        await enteringEmail(frame, credentials);
    }

    await frame.waitForTimeout(1000);

    async function selectingCountry(frame) {
        const labelForCountry = await frame.$('label[for="country"]');
        await labelForCountry.click();
        await frame.waitForTimeout(2000);

        const InputCountry = await frame.$('input[name="country"]');
        await InputCountry.type("Russia");
        await frame.waitForTimeout(2000);

        const russiaCountry = await frame.$("#react-select-2-option-46");
        await russiaCountry.click();
    }
    try {
        await selectingCountry(frame);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "selectingCountry");
        await selectingCountry(frame);
    }

    await frame.waitForTimeout(2000);

    async function enteringCountry(frame, credentials) {
        credentials.elamaPhone = "+79" + Math.round(Math.random() * 899999999 + 100000000);

        const inputPhone = await frame.$("#InputElement__phone");
        await inputPhone.click({ clickCount: 3 });
        await frame.type("#InputElement__phone", credentials.elamaPhone, { delay: 40 });
        await frame.waitForTimeout(2000);
    }
    try {
        await enteringCountry(frame, credentials);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "enteringCountry");
        await enteringCountry(frame, credentials);
    }

    async function approvingPolicy(frame) {
        const chb = await frame.$("#one");
        const parent_node = await chb.getProperty("parentNode");
        await parent_node.click();
    }
    try {
        await approvingPolicy(frame);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "approvingPolicy");
        await approvingPolicy(frame);
    }

    await frame.waitForTimeout(3000);

    async function submitingRegisteration(frame) {
        const submit = await frame.$('button[type="submit"]');
        await submit.click();
    }

    try {
        await submitingRegisteration(frame);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "submitingRegisteration");
        await submitingRegisteration(frame);
    }

    async function goingThroughtForm1(frame) {
        await frame.waitForSelector('input[value="advertising-self-business"]');

        await frame.waitForTimeout(9000);

        const selfBus = await frame.$('input[value="advertising-self-business"]');
        await selfBus.click();
        await frame.waitForTimeout(9000);

        const selfBusNext = await frame.$("button");
        await selfBusNext.click();
    }
    try {
        await goingThroughtForm1(frame);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "goingThroughtForm1");
        await goingThroughtForm1(frame);
    }

    async function goingThroughtForm2(frame) {
        await frame.waitForSelector('input[value="up-to-20"]');
        const budget = await frame.$('input[value="up-to-20"]');
        await budget.click();
        await frame.waitForTimeout(2000);
    }
    try {
        await goingThroughtForm2(frame);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "goingThroughtForm2");
        await goingThroughtForm2(frame);
    }

    async function goingThroughtForm3(frame) {
        const product = await frame.$('input[type="text"]');
        await product.click({ clickCount: 3 });
        await product.type("sample product");
    }
    try {
        await goingThroughtForm3(frame);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "goingThroughtForm3");
        await goingThroughtForm3(frame);
    }
    await frame.waitForTimeout(2000);

    async function submitGoingThroughtForm(frame) {
        const productNexts = await frame.$$("button");
        for (let i in productNexts) {
            const shouldClick = await productNexts[i].evaluate((el) => {
                return el.innerText.toLowerCase().includes("тправить");
            });
            if (shouldClick) {
                await productNexts[i].click();
                break;
            }
        }
    }
    try {
        await submitGoingThroughtForm(frame);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "submitGoingThroughtForm");
        await submitGoingThroughtForm(frame);
    }
    // await productNext.click();

    await frame.waitForTimeout(10000);

    async function comeInAccount(frame) {
        await frame.waitForSelector("a");
        const ahrefs = await frame.$$("a");
        for (let i in ahrefs) {
            const shouldClick = await ahrefs[i].evaluate((el) => {
                return el.innerText.toLowerCase().includes("ерейти в личный кабинет");
            });
            if (shouldClick) {
                await ahrefs[i].click();
                break;
            }
        }
    }
    try {
        await comeInAccount(frame);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "comeInAccount");
        await comeInAccount(frame);
    }

    await frame.waitForTimeout(20000);

    // try {
    //     const intercomFrame = await frame.waitForSelector('iframe[name="intercom-tour-frame"]');

    //     const closeIntercom = await intercomFrame.waitForSelector('span[role="button"][class*="intercom-"]');
    //     await closeIntercom.click();
    // } catch (err) {
    //     console.log("intercom-container do not found");
    //     console.log(err);
    // }

    async function clickAddNewAccount(frame) {
        const addAccounts = await frame.$$("button");

        for (let i in addAccounts) {
            const shouldClick = await addAccounts[i].evaluate((el) => {
                return el.innerText.toLowerCase().includes("обавить аккаунт");
            });
            if (shouldClick) {
                await addAccounts[i].click();
                break;
            }
        }
    }
    try {
        await clickAddNewAccount(frame);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "clickAddNewAccount");
        await clickAddNewAccount(frame);
    }

    await frame.waitForTimeout(2000);

    async function selectingGoogleAccount(frame) {
        const GoogleAccountBtn = await frame.waitForSelector(
            'div[data-analytics-element="choose-add-adwords-account"]'
        );
        await GoogleAccountBtn.click();
    }
    try {
        await selectingGoogleAccount(frame);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "selectingGoogleAccount");
        await selectingGoogleAccount(frame);
    }

    await frame.waitForTimeout(2000);

    async function selectingInternalAccount(frame) {
        //data-test="AccountTypeSelectorButton__internal"
        const internalAccount = await frame.waitForSelector('div[data-test="AccountTypeSelectorButton__internal"]');
        await internalAccount.click();
    }
    try {
        await selectingInternalAccount(frame);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "selectingInternalAccount");
        await selectingInternalAccount(frame);
    }
    await frame.waitForTimeout(2000);

    async function clickingAccountTypeSelectionNext(framme) {
        const addAccountsSelect = await frame.$$("button");
        for (let i in addAccountsSelect) {
            const shouldClick = await addAccountsSelect[i].evaluate((el) => {
                return el.innerText.toLowerCase().includes("алее");
            });
            if (shouldClick) {
                await addAccountsSelect[i].click();
                break;
            }
        }
    }
    try {
        await clickingAccountTypeSelectionNext(frame);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "clickingAccountTypeSelectionNext");
        await clickingAccountTypeSelectionNext(frame);
    }

    await frame.waitForTimeout(2000);

    // const gmail = await frame.waitForSelector('input[name="email"]');
    // await gmail.click({ clickCount: 3 });
    // await frame.waitForTimeout(2000);

    async function selectingCurrency(frame) {
        const curencySelect = await frame.$('input[value="RUB"]');
        await curencySelect.click();
        await frame.waitForTimeout(2000);

        const curencySelected = await frame.$('div[data-value="USD"]');
        await curencySelected.click();
        await frame.waitForTimeout(2000);
    }
    try {
        await selectingCurrency(frame);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "selectingCurrency");
        await selectingCurrency(frame);
    }

    async function sendingRequestForNewAccount(frame) {
        const sendAccountsBtns = await frame.$$("button");
        for (let i in sendAccountsBtns) {
            const shouldClick = await sendAccountsBtns[i].evaluate((el) => {
                return el.innerText.toLowerCase().includes("тправить заявку");
            });
            if (shouldClick) {
                await sendAccountsBtns[i].click();
                break;
            }
        }
    }
    try {
        await sendingRequestForNewAccount(frame);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "sendingRequestForNewAccount");
        await sendingRequestForNewAccount(frame);
    }
    await frame.waitForTimeout(20000);

    async function clickingGoToAdCreation(frame) {
        const goToCreaation = await frame.waitForSelector('a[href*="/tools/ga-ads"]');
        await frame.waitForTimeout(2000);
        await goToCreaation.click();
    }
    try {
        await clickingGoToAdCreation(frame);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "clickingGoToAdCreation");
        await clickingGoToAdCreation(frame);
    }

    await frame.waitForTimeout(20000);

    async function openTabTargeting(frame) {
        const targetingStep = await frame.$('div[data-test="Step__TARGETING"]');
        await targetingStep.click();
    }
    try {
        await openTabTargeting(frame);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "openTabTargeting");
        await openTabTargeting(frame);
    }

    await frame.waitForTimeout(2000);

    async function selectingGeo(frame) {
        const inputTargetingGeo = await frame.$('input[data-test="TargetingGeo_include"]');
        await inputTargetingGeo.click({ clickCount: 3 });
        await inputTargetingGeo.type("челябинск");
        await frame.waitForTimeout(2000);
        const dropDowns = await frame.$('div[data-test="dropdown-TargetingGeo_include"]');
        const dropDown = await dropDowns.$("div");
        await dropDown.click();
    }
    try {
        await selectingGeo(frame);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "selectingGeo");
        await selectingGeo(frame);
    }

    await frame.waitForTimeout(2000);

    // OFFER

    async function enteringKeyWord(frame, OFFERS) {
        const keywordField = await frame.$("#keyword");
        for (let i in OFFERS.keywords) {
            await keywordField.click({ clickCount: 3 });
            await keywordField.type(OFFERS.keywords[i].word);
            await frame.waitForTimeout(2000);
            const addKwBtns = await frame.$('div[data-test="CreateKeyword_button"]');
            await addKwBtns.click();

            await frame.waitForTimeout(12000);
            await addKwBtns.click();

            await frame.waitForTimeout(12000);
            await addKwBtns.click();

            await frame.waitForTimeout(12000);
            break;
        }
    }
    try {
        await enteringKeyWord(frame, OFFERS);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "enteringKeyWord");
        await enteringKeyWord(frame, OFFERS);
    }

    async function openTapGrouping(frame) {
        const groupingStep = await frame.$('div[data-test="Step__GROUPING"]');
        await groupingStep.click();
    }
    try {
        await openTapGrouping(frame);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "openTapGrouping");
        await openTapGrouping(frame);
    }

    await frame.waitForTimeout(2000);
    await frame.waitForTimeout(2000);

    async function selectingKeyWords(frame) {
        const kws = await frame.$$("div[title]");
        for (let iK in kws) {
            await kws[iK].click();
        }
    }
    try {
        await selectingKeyWords(frame);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "selectingKeyWords");
        await selectingKeyWords(frame);
    }
    await frame.waitForTimeout(2000);

    async function enteringGroupName(frame) {
        const createBtn = await frame.$('div[data-test="CreateGroup_button"]');
        await createBtn.click();
        await frame.waitForTimeout(2000);
        const groupName = await frame.$("input#name");
        await groupName.type("AdGroup - 1");
        await frame.waitForTimeout(2000);

        const saveGroupBtn = await frame.$('button[data-test="GroupNameForm_submit"]');
        await saveGroupBtn.click();
    }
    try {
        await enteringGroupName(frame);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "enteringGroupName");
        await enteringGroupName(frame);
    }
    await frame.waitForTimeout(2000);

    async function selectingTabCreatingAds(frame) {
        const createAdBtn = await frame.$('button[data-test="NextStep_click_CREATING_ADS"]');
        await createAdBtn.click();
    }
    try {
        await selectingTabCreatingAds(frame);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "selectingTabCreatingAds");
        await selectingTabCreatingAds(frame);
    }

    await frame.waitForTimeout(2000);
    await frame.waitForTimeout(2000);
    await frame.waitForTimeout(2000);

    async function addingUrl(frame, OFFERS) {
        const openDialogAddLink = await frame.$('div[data-test*="_landingLink"]');
        await openDialogAddLink.click();
        await frame.waitForTimeout(2000);
        const inputAdUrl = await frame.$("input#url");
        await inputAdUrl.click({ clickCount: 3 });
        await inputAdUrl.type(OFFERS.url);
        await frame.waitForTimeout(2000);
        // data-test="ModalCommon_add_asd"
        const saveUrl = await frame.$('button[data-test="ModalCommon_add_asd"]');
        await saveUrl.click();
    }
    try {
        await addingUrl(frame, OFFERS);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "addingUrl");
        await addingUrl(frame, OFFERS);
    }

    await frame.waitForTimeout(2000);

    //   =    = ====     = = = = = = = = = =
    async function addingH1(frame, OFFERS) {
        const openDialogAddH1 = await frame.$('div[data-test*="_firstHeader"]');
        await openDialogAddH1.click();
        await frame.waitForTimeout(2000);
        const h1 = OFFERS.h1[Math.floor(Math.random() * OFFERS.h1.length)];
        const inputH1 = await frame.$('input[data-test="ModalHeadline_input_0"]');
        await inputH1.type(h1);
        await frame.waitForTimeout(2000);
        const saveH1 = await frame.$('button[data-test="ModalCommon_add_asd"]');
        await saveH1.click();
    }
    try {
        await addingH1(frame, OFFERS);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "addingH1");
        await addingH1(frame, OFFERS);
    }
    await frame.waitForTimeout(2000);
    //   =    = ====     = = = = = = = = = =

    async function addingH2(frame, OFFERS) {
        const openDialogAddH2 = await frame.$('div[data-test*="_secondHeader"]');
        await openDialogAddH2.click();
        await frame.waitForTimeout(2000);

        const h2 = OFFERS.h2[Math.floor(Math.random() * OFFERS.h2.length)];
        const inputH2 = await frame.$('input[data-test="ModalHeadline_input_0"]');
        await inputH2.type(h2);
        await frame.waitForTimeout(2000);
        const saveH2 = await frame.$('button[data-test="ModalCommon_add_asd"]');
        await saveH2.click();
    }
    try {
        await addingH2(frame, OFFERS);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "addingH2");
        await addingH2(frame, OFFERS);
    }
    await frame.waitForTimeout(2000);
    //   =    = ====     = = = = = = = = = =

    async function addingH3(frame, OFFERS) {
        const openDialogAddH3 = await frame.$('div[data-test*="_thirdHeader"]');
        await openDialogAddH3.click();
        await frame.waitForTimeout(2000);

        const h3 = OFFERS.h3[Math.floor(Math.random() * OFFERS.h3.length)];
        const inputH3 = await frame.$('input[data-test="ModalHeadline_input_0"]');
        await inputH3.type(h3);
        await frame.waitForTimeout(2000);
        const saveH3 = await frame.$('button[data-test="ModalCommon_add_asd"]');
        await saveH3.click();
    }
    try {
        await addingH3(frame, OFFERS);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "addingH3");
        await addingH3(frame, OFFERS);
    }
    await frame.waitForTimeout(2000);
    //   =    = ====     = = = = = = = = = =
    async function addingD1(frame, OFFERS) {
        const openDialogAddD1 = await frame.$('div[data-test*="_firstDescription"]');
        await openDialogAddD1.click();
        await frame.waitForTimeout(2000);

        const d1 = OFFERS.d1[Math.floor(Math.random() * OFFERS.d1.length)];
        const inputD1 = await frame.$('input[data-test="ModalDescriptions_first"]');
        await inputD1.type(d1);
        await frame.waitForTimeout(2000);
        const saveD1 = await frame.$('button[data-test="ModalCommon_add_asd"]');
        await saveD1.click();
    }
    try {
        await addingD1(frame, OFFERS);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "addingD1");
        await addingD1(frame, OFFERS);
    }
    await frame.waitForTimeout(2000);
    //   =    = ====     = = = = = = = = = =
    async function addingD2(frame, OFFERS) {
        const openDialogAddD2 = await frame.$('div[data-test*="_secondDescription"]');
        await openDialogAddD2.click();
        await frame.waitForTimeout(2000);

        const d2 = OFFERS.d2[Math.floor(Math.random() * OFFERS.d2.length)];
        const inputD2 = await frame.$('input[data-test="ModalDescriptions_first"]');
        await inputD2.type(d2);
        await frame.waitForTimeout(2000);
        const saveD2 = await frame.$('button[data-test="ModalCommon_add_asd"]');
        await saveD2.click();
    }
    try {
        await addingD2(frame, OFFERS);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "addingD2");
        await addingD2(frame, OFFERS);
    }
    await frame.waitForTimeout(2000);

    //_clarification
    //   =    = ====     = = = = = = = = = =
    async function addingSnippets(frame, OFFERS) {
        const openDialogAddSnippets = await frame.$('div[data-test*="_clarification"]');
        await openDialogAddSnippets.click();
        await frame.waitForTimeout(2000);
        const plusExt1Btns = await frame.$$("div");
        for (let i in plusExt1Btns) {
            const shouldClick = await plusExt1Btns[i].evaluate((el) => {
                return el.innerText === "+ Добавить поле для уточнения";
            });
            if (shouldClick) {
                for (let cl = 0; cl < 5; cl++) {
                    await plusExt1Btns[i].click();
                    await frame.waitForTimeout(2000);
                }
                break;
            }
        }
        for (let iS in OFFERS.snippets) {
            const inputSnipet = await frame.$('input[data-test="ModalCallouts_inp_' + iS + '"]');
            await inputSnipet.click({ clickCount: 3 });
            await inputSnipet.type(OFFERS.snippets[iS]);
            await frame.waitForTimeout(2000);
        }
        const saveSnipets = await frame.$('button[data-test="ModalCommon_add_asd"]');
        await saveSnipets.click();
    }
    try {
        await addingSnippets(frame, OFFERS);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "addingSnippets");
        await addingSnippets(frame, OFFERS);
    }
    await frame.waitForTimeout(2000);
    //_fastLinks
    //   =    = ====     = = = = = = = = = =
    async function addingFastLinks(frame, OFFERS) {
        const openDialogAddFastLinks = await frame.$('div[data-test*="_fastLinks"]');
        await openDialogAddFastLinks.click();
        await frame.waitForTimeout(2000);

        const plusExt2Btns = await frame.$$("div");
        for (let i in plusExt2Btns) {
            const shouldClick = await plusExt2Btns[i].evaluate((el) => {
                return el.innerText === "+ Добавить дополнительную ссылку";
            });
            if (shouldClick) {
                for (let cl = 0; cl < 5; cl++) {
                    await plusExt2Btns[i].click();
                    await frame.waitForTimeout(1000);
                }
                break;
            }
        }
        await frame.waitForTimeout(2000);

        const openDs = await frame.$$("div");
        for (let iD in openDs) {
            const shouldClick = await openDs[iD].evaluate(
                (el) => el.innerText === "+ Добавить описание к дополнительной ссылке"
            );
            if (shouldClick) {
                await openDs[iD].click();
                await frame.waitForTimeout(1000);
            }
        }

        for (let iL in OFFERS.additionalLinks) {
            const urlInput = await frame.$('input[data-test="LinkItem_link-' + iL + '"]');
            await urlInput.click({ clickCount: 3 });
            await urlInput.type(OFFERS.url + OFFERS.additionalLinks[iL].url);
            const hInput = await frame.$('input[data-test="LinkItem_text-' + iL + '"]');
            await hInput.click({ clickCount: 3 });
            await hInput.type(OFFERS.additionalLinks[iL].h);
            const d1Input = await frame.$('input[data-test="LinkItem_description_1-' + iL + '"]');
            await d1Input.click({ clickCount: 3 });
            await d1Input.type(OFFERS.additionalLinks[iL].d1);
            const d2Input = await frame.$('input[data-test="LinkItem_description_2-' + iL + '"]');
            await d2Input.click({ clickCount: 3 });
            await d2Input.type(OFFERS.additionalLinks[iL].d2);
            await frame.waitForTimeout(1000);
        }
        await frame.waitForTimeout(2000);

        const saveFastLinks = await frame.$('button[data-test="ModalCommon_add_asd"]');
        await saveFastLinks.click();
    }
    try {
        await addingFastLinks(frame, OFFERS);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "addingFastLinks");
        await addingFastLinks(frame, OFFERS);
    }
    await frame.waitForTimeout(2000);
    // const protocolsSelects = await frame.$$('input[value="https://"]');
    // for (let i in protocolsSelects) {
    //     await protocolsSelects[i].click();
    // }

    // const creatingStep = await frame.$('div[data-test="Step__CREATING_ADS"]');
    // await creatingStep.click();
    // await frame.waitForTimeout(2000);
    async function selectingTabBudget(frame) {
        const budgetStep = await frame.$('div[data-test="Step__BUDGET"]');
        await budgetStep.click();
    }
    try {
        await selectingTabBudget(frame);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "selectingTabBudget");
        await selectingTabBudget(frame);
    }
    await frame.waitForTimeout(2000);

    const budgetFrom = OFFERS.budget.from;
    const budgetTo = !OFFERS.budget.to
        ? OFFERS.budget.from
        : OFFERS.budget.from > OFFERS.budget.to
        ? OFFERS.budget.from
        : OFFERS.budget.to;

    const _budget = Math.round(((budgetTo - budgetFrom) * Math.random() + budgetFrom) * 100) / 100;
    await frame.waitForTimeout(2000);

    async function fillingOutBudget(frame, _budget) {
        const budgetInput = await frame.$("input#expenses");
        // await budgetInput.click({ clickCount: 3 });
        await frame.waitForTimeout(2000);
        // console.log("budgetInput", budgetInput, _budget);
        await budgetInput.type(`${_budget}`);
        await frame.waitForTimeout(2000);
    }
    try {
        await fillingOutBudget(frame, _budget);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "fillingOutBudget");
        await fillingOutBudget(frame, _budget);
    }

    async function fillingOutFraction(frame) {
        const fractionInput = await frame.$("input#fraction");
        await fractionInput.click({ clickCount: 3 });
        await fractionInput.type("100");
        await frame.waitForTimeout(2000);
    }
    try {
        await fillingOutFraction(frame);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "fillingOutFraction");
        await fillingOutFraction(frame);
    }

    async function fillingOutMaxCPC(frame, OFFERS) {
        const costLimitInput = await frame.$("input#costLimit");
        await costLimitInput.click({ clickCount: 3 });
        await frame.waitForTimeout(2000);
        await costLimitInput.type(`${OFFERS.maxCPC}`, { delay: 50 });
        await frame.waitForTimeout(2000);
    }

    try {
        await fillingOutMaxCPC(frame, OFFERS);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "fillingOutMaxCPC");
        await fillingOutMaxCPC(frame, OFFERS);
    }

    async function selectingTabExport(frame) {
        const exportStep = await frame.$('div[data-test="Step__EXPORT"]');
        await exportStep.click();
    }
    try {
        await selectingTabExport(frame);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "selectingTabExport");
        await selectingTabExport(frame);
    }
    await frame.waitForTimeout(2000);

    async function switchingOffUtms(frame) {
        const chbUtm = await frame.$('input[type="checkbox"]');
        await chbUtm.click();
    }
    try {
        await switchingOffUtms(frame);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "switchingOffUtms");
        await switchingOffUtms(frame);
    }

    async function exporting(frame) {
        const exportBtn = await frame.$('button[data-test="ExportFooter_finishAndEnable"]');
        await exportBtn.click();
    }
    try {
        await exporting(frame);
    } catch (error) {
        await frame.waitForTimeout(10000);
        console.log(error);
        console.log("second attempt....", "exporting");
        await exporting(frame);
    }

    return;
}
