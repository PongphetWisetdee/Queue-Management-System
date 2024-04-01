export interface QueueRequest {
    shopId: string;
    queueDate: string;
  };

  export interface QueueRequestForWeb {
    queueId: string;
    statusId: string;
    isQueueExist: string;
  };