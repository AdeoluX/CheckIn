import { randomUUID } from 'crypto'
import { AddressModel } from '../models/address.schema'
import { AddressQRModel } from '../models/addressQR.schema'
import { CompanyModel } from '../models/company.schema'
import { CompanyAddressModel, ICompanyAddress } from '../models/companyAddress.schema'
import cron from 'node-cron'

export class JobService {
   static scheduler () {
     cron.schedule('01 23 * * *', async () => {
        // create address qr for all addresses for all companies
        const allCompanies = await CompanyModel.find()
        for(let item of allCompanies){
            let allAddress = await CompanyAddressModel.find({
                company: item._id
            }).populate('address')
            let addressQr = []
            for(let address of allAddress){
                addressQr.push({
                    qrString: randomUUID(),
                    address: address._id
                })
            }
            const addressQR_ = await AddressQRModel.create({
                addressQr,
                company: item._id
            })
        }
     })
   }
}