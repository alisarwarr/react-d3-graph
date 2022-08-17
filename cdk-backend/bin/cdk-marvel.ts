#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkMarvelStack } from '../lib/cdk-marvel-stack';


const app = new cdk.App();
new CdkMarvelStack(app, 'CdkMarvelStack');