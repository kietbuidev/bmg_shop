// import admin, {credential, ServiceAccount} from 'firebase-admin';
// import {BatchResponse} from 'firebase-admin/lib/messaging/messaging-api';

// type TFirebaseAdmin = typeof import('firebase-admin');

// interface FirebaseAdminOptions {
//   projectId: string;
//   privateKey: string;
//   clientEmail: string;
//   // databaseURL: string;
// }

// class FirebaseAdmin {
//   private static instance?: FirebaseAdmin;
//   private admin: TFirebaseAdmin;

//   private constructor(firebaseAdmin: TFirebaseAdmin) {
//     this.admin = firebaseAdmin;
//   }

//   static initialize(): void {
//     if (this.instance) throw new Error('Instance already initialized.');

//     let convertSA = serviceAccountLive;
//     const options: FirebaseAdminOptions = {
//       projectId: convertSA['project_id'],
//       privateKey: convertSA['private_key'],
//       clientEmail: convertSA['client_email'],
//     };

//     const {projectId, privateKey, clientEmail} = options;
//     let serviceAccount: ServiceAccount = {
//       projectId,
//       privateKey,
//       clientEmail,
//     };

//     const adminConfig = {
//       credential: credential.cert(serviceAccount),
//     };

//     admin.initializeApp(adminConfig);
//     this.instance = new FirebaseAdmin(admin);
//   }

//   static getInstance(): FirebaseAdmin {
//     if (!this.instance) throw new Error('Instance needs to be initialized first.');
//     return this.instance;
//   }

//   sendMulticastMessaging(tokens: string[], title: string, body: string, imageUrl?: string | null, data?: Record<string, string>): Promise<BatchResponse> {
//     const message: admin.messaging.MulticastMessage = {
//       tokens,
//       notification: {
//         title: title,
//         body: body,
//       },
//       android: {
//         notification: {
//           imageUrl: imageUrl,
//           clickAction: 'OPEN_APP', // hoặc deeplink nếu cần
//         },
//       },
//       apns: {
//         payload: {
//           aps: {
//             'mutable-content': 1,
//           },
//         },
//         fcmOptions: {
//           image: imageUrl,
//         } as any,
//       },
//       webpush: {
//         notification: {
//           title: title,
//           body: body,
//           icon: 'https://your-domain.com/icon.png', // icon hiển thị trên web
//           image: imageUrl,
//           click_action: 'https://your-domain.com/promotion/330k',
//           fcmOptions: {
//             link: 'https://your-domain.com/promotion/330k',
//           },
//         },
//       },
//       data: {
//         // Bạn có thể thêm deep link hoặc type
//         deeplink: 'heyotrip://promo/330k', // Optional
//         type: 'PROMOTION', // Optional
//       },
//     };

//     return this.admin.messaging().sendEachForMulticast(message);
//   }

//   sendMessaging(token: string, title: string, body: string, imageUrl: string | null, data?: Record<string, string>): Promise<string> {
//     const message: admin.messaging.Message = {
//       token,
//       notification: {
//         title: title,
//         body: body,
//       },
//       android: {
//         notification: {
//           imageUrl: imageUrl,
//           clickAction: 'OPEN_APP', // hoặc deeplink nếu cần
//         },
//       },
//       apns: {
//         payload: {
//           aps: {
//             'mutable-content': 1,
//           },
//         },
//         fcmOptions: {
//           image: imageUrl,
//         } as any,
//       },
//       webpush: {
//         notification: {
//           title: title,
//           body: body,
//           icon: 'https://heyotrip-img.s3.ap-southeast-1.amazonaws.com/images/upload/avatar/dev/1749050142773.png', // icon hiển thị trên web
//           image: imageUrl,
//           click_action: 'https://your-domain.com/promotion/330k',
//           fcmOptions: {
//             link: 'https://your-domain.com/promotion/330k',
//           },
//         },
//       },
//       data: {
//         // Bạn có thể thêm deep link hoặc type
//         deeplink: 'heyotrip://promo/330k', // Optional
//         type: 'PROMOTION', // Optional
//       },
//     };

//     return admin.messaging().send(message);
//   }

//   sendCustomMessaging(token: string, data?: Record<string, string>): Promise<string> {
//     const message: admin.messaging.Message = {
//       token,
//       data: {
//         ...data,
//       },
//       android: {
//         priority: 'high',
//       },
//       apns: {
//         headers: {
//           'apns-priority': '10',
//         },
//         payload: {
//           aps: {
//             'content-available': 1,
//           },
//         },
//       },
//     };

//     return admin.messaging().send(message);
//   }
// }

// export async function sendNoficationMessages(tokens: string[], notification: NotificationRequest) {
//   // Get the FirebaseAdmin instance
//   const firebaseAdmin = FirebaseAdmin.getInstance();
//   try {
//     const batchResponse = await firebaseAdmin.sendMulticastMessaging(tokens, notification.title, notification.content, notification.image);
//     return batchResponse;
//   } catch (error) {
//     return error;
//   }
// }

// export function sendNoficationMessage(token: string, notification: NotificationRequest) {
//   // Get the FirebaseAdmin instance
//   const firebaseAdmin = FirebaseAdmin.getInstance();
//   firebaseAdmin
//     .sendMessaging(token, notification.title, notification.content, notification.image)
//     .then((batchResponse) => {
//       console.log('Push notification sent:', batchResponse);
//     })
//     .catch((error) => {
//       console.error('Error sending push notification:', error);
//     });
// }

// export function sendNotifyCustomMessage(token: string, notification: NotificationRequest) {
//   // Get the FirebaseAdmin instance
//   const firebaseAdmin = FirebaseAdmin.getInstance();
//   firebaseAdmin
//     .sendCustomMessaging(token, notification.data)
//     .then((batchResponse) => {
//       console.log('Token:', token);
//       console.log('Push notification sent:', batchResponse);
//     })
//     .catch((error) => {
//       console.error('Error sending push notification:', error);
//     });
// }

// export default FirebaseAdmin;
