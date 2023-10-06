// import express from "express";
// import dotenv from "dotenv";
// import stripe from "stripe";

// //Load variables
// dotenv.config();

// import cors from "cors";
// // ...


// //start server
// const app = express();
// app.use(cors());

// app.use(express.static("public"));
// app.use(express.json);

// //Home route
// app.get("/", (req, res) => {
//     res.sendFile("index.html", {root: "public"});
// });

// //success url
// app.get("/success", (req, res) => {
//     res.sendFile("success.html", {root: "public"});
// });
// //cancel
// app.get("/cancel", (req, res) => {
//     res.sendFile("cancel.html", {root: "public"});
// });

// //Stripe
// let stripeGateway = stripe(process.env.stripe_api);
// let DOMAIN = process.env.DOMAIN;

// app.post("/stripe-checkout", async ( req, res) => {
//     console.log("stripe")
//     const lineItems = req.body.item.map((item) => {
//         const unitAmount = parseInt(item.price.replace(/[^0-9.-]+/g, "") * 100);
//         console.log("item-price:",item.price);
//         console.log("unitAmount:",unitAmount);
//         return{
//             price_data: {
//                 currency: "rupee",
//                 product_data: {
//                     name: item.title,
//                     images: [item.productImg],
//                 },
//                 unit_amount: unitAmount,
//             },
//             quantity: item.quantity,
//         };
//     });
//     console.log("lineItems:",lineItems);

//     //create checkout session
//     const session = await stripeGateway.checkout.session.create({
//         payment_method_types: ["card"],
//         mode: "payment",
//         success_url: `${DOMAIN}/success`,
//         cancel_url: `${DOMAIN}/cancel`,
//         line_items: lineItems,
//        //Asking address
//         billing_address_collection: "required", 
//     });
//     res.json(session.url);
// });

// app.listen(5000, () => {
//     console.log("listening on port 5000;");
// });


import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import stripeModule from "stripe";

// Load variables
dotenv.config();

// Create an instance of Stripe
const stripeGateway = stripeModule(process.env.stripe_api);
const DOMAIN = process.env.DOMAIN;

// Start server
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Home route
app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "public" });
});

// Success route
app.get("/success", (req, res) => {
    res.sendFile("success.html", { root: "public" });
});

// Cancel route
app.get("/cancel", (req, res) => {
    res.sendFile("cancel.html", { root: "public" });
});

// Stripe checkout route
app.post("/stripe-checkout", async (req, res) => {
    try {
        const lineItems = req.body.items.map((item) => {
            const unitAmount = parseInt(item.price.replace(/[^0-9.-]+/g, "") * 100);
            return {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: item.title,
                        images: [item.productImg],
                    },
                    unit_amount: unitAmount,
                },
                quantity: item.quantity,
            };
        });

        // Create checkout session
        const session = await stripeGateway.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            success_url: `${DOMAIN}/success`,
            cancel_url: `${DOMAIN}/cancel`,
            line_items: lineItems,
            billing_address_collection: "required", // Asking for address
        });

        res.json(session.url);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "An error occurred while processing your request." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



