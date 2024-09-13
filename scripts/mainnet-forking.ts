import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
    const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const USDC_ADDRESS = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const DAI_ADDRESS = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

    const to = "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7"

    await helpers.impersonateAccount(to);
    const impersonatedSigner = await ethers.getSigner(to);


    const amountADesired = ethers.parseUnits("70", 18);
    const amountBDesired = ethers.parseUnits("70", 18);
    
    const USDC_CONTRACT = await ethers.getContractAt("IERC20", USDC_ADDRESS, impersonatedSigner);
    const DAI_CONTRACT = await ethers.getContractAt("IERC20", DAI_ADDRESS, impersonatedSigner);

    const ROUTER = await ethers.getContractAt("IUniswapV2Router", ROUTER_ADDRESS, impersonatedSigner);
    
    await USDC_CONTRACT.approve(ROUTER, amountADesired);
    await DAI_CONTRACT.approve(ROUTER, amountBDesired);
    
    const amountAMin = ethers.parseUnits("100", 6);
    const amountBMin = ethers.parseUnits("100", 6);

    const deadline = Math.floor(Date.now() / 1000) + (60 * 10);

    const usdcBal = await USDC_CONTRACT.balanceOf(impersonatedSigner.address);
    const daiBal = await DAI_CONTRACT.balanceOf(impersonatedSigner.address);
    
    console.log("usdc balance before adding in liquidity", Number(usdcBal))
    console.log("dai balance before adding in liquidity", Number(daiBal))

    
    await ROUTER.addLiquidity(
        USDC_ADDRESS,
        DAI_ADDRESS,
        amountADesired,
        amountBDesired,
        amountAMin,
        amountBMin,
        to,
        deadline
    );

    const usdcBalAfter = await USDC_CONTRACT.balanceOf(impersonatedSigner.address);
    const daiBalAfter = await DAI_CONTRACT.balanceOf(impersonatedSigner.address);
    console.log("=========================================================");

    console.log("usdc balance after adding in liquidity", Number(usdcBalAfter))
    console.log("dai balance after adding in liquidity", Number(daiBalAfter))
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
