export enum Strategy {
  NONE_WITH_SUCCESS = 'None (with success)',
  NONE_WITH_ERROR  = 'None (with error)',
  CATCH_AND_REPLACE = 'Catch and replace',
  CATCH_AND_RETHROW = 'Catch and rethrow',
  IMMEDIATE_RETRY = 'Immediate retry',
  DELAYED_RETRY = 'Delayed retry',
  DELAYED_MAXRETRY = 'Delayed retry (max retry 2x)'
}
