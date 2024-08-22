import { DynamicModule, Module, Provider } from "@nestjs/common";
import { config } from "dotenv";
import Stripe from "stripe";
import { STRIPE_CLIENT } from "./constant";



@Module({})
export class StripeModule{
    static forRoot(apiKey:string , config: Stripe.StripeConfig):  DynamicModule{
        const stripe = new Stripe(apiKey,config);
        const stripeProviders: Provider = {
            provide: STRIPE_CLIENT,
            useValue: stripe,
        }
        return {
            module: StripeModule,
            providers: [stripeProviders],
            exports: [stripeProviders],
            global: true,
        }
    }
}