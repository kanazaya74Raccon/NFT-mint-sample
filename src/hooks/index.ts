import { ethers } from "ethers";
import { Interface } from '@ethersproject/abi';
import { Contract } from "@ethersproject/contracts";
import { useContractCall, useContractFunction, ContractCall } from "@usedapp/core";
import simpleContractAbi from "../abi/Dick.json";
import { DickContractAddress } from "../contracts"

const abi: Interface = new Interface(simpleContractAbi);
const carzyBongInterface = new ethers.utils.Interface(simpleContractAbi);

const contract = new Contract(DickContractAddress, carzyBongInterface);

export function useContractMethod(methodName: string) {
  const { state, send } = useContractFunction(contract, methodName, {});
  return { state, send };
}