
import * as fs from 'fs'
import {merge, map, find} from 'lodash'
import * as path from 'path'
import { defaultConfig  } from './default'
import { Query } from './query'
let query = new Query()
export class Stack {
    baseDir: any;
    masterLocale: any;
    config: any;
    content_type_uid: string;
    type: string;
    _query: any={};
    asset_uid: any;
    entry_uid: any
    _entry: string;
    single: boolean = false;

    constructor(...stack_arguments) {
        this.baseDir
        this.masterLocale
        this.config = merge(defaultConfig, ...stack_arguments)
    }

    public connect(overrides:Object = {}) {
        this.config = merge(this.config, overrides)
        return new Promise((resolve, reject) => {
            try {
                if (!this.config['content-connector'].hasOwnProperty('base_dir')) {
                    throw new Error('Please provide base_dir to connect the filesystem.')
                } else if (!this.config.hasOwnProperty('locales') || this.config.locales.length == 0){
                    throw new Error('Please provide locales with code and relative_url_prefix.\n Example ==> locales:[{code:"en-us",relative_ul_prefix:"/"}].')
                } else if (!(fs.existsSync(this.config['content-connector'].base_dir))) {
                    throw new Error(`${this.config['content-connector'].base_dir} didn't exits.`)
                } else {
                    this.baseDir = this.config['content-connector'].base_dir
                    this.masterLocale = this.config.locales[0].code
                    return resolve(this.config['content-connector'])
                }
            } catch (error) {
                reject(error)
            }
        })
    }

    public contentType(uid) {
        if (this.baseDir == undefined){
            throw new Error('Please call the Stack.connect() first')
        }
        if (uid && typeof uid === 'string') {
            this.content_type_uid = uid
            this.type = 'contentType'
        }
        return this
    }

    public entries() {
        const entry = query
        this._entry = 'multiple'
        if (this.type == undefined) {
            throw new Error("Please call contentType('uid') first")
        }
        return merge(entry, this)
    }
    
    public find() {
        const baseDir = this.baseDir
        const masterLocale = this.masterLocale
        const locale = (!this._query.locale) ? masterLocale : this._query.locale
        let result
        return new Promise((resolve, reject) => {
            if (this.type == 'asset') {
                const dataPath = path.join(baseDir, locale, 'assets', '_assets.json')
                if (!fs.existsSync(dataPath)) {
                    return reject(`${dataPath} didn't exist`)
                } else {
                    fs.readFile(dataPath, 'utf8', (err, data) => {
                        if (err) {
                            return reject(err)
                        } else {
                          const finalRes = {}
                          let type = (this.asset_uid)? "asset": "assets"
                          if(this.single){
                            type="asset"
                          }
                          if(!data){
                            if(type == "asset"){
                              finalRes[type] =null
                            }else{
                              finalRes[type] =[]
                            }
                            return resolve(finalRes)
                           }
                            const assetData = JSON.parse(data)
                            
                            if (this.asset_uid){
                                result = find(assetData, { uid: this.asset_uid })
                                finalRes[type] = result
                            }else{
                                result = assetData
                                finalRes[type] = result
                            }

                            if(this.single){
                              type="asset"
                              finalRes[type] = result[0]
                            }
                            resolve(finalRes)
                        }
                    })
                }

            }
            else if(this.type !== "asset" && !this._entry){
              const dataPath = path.join(baseDir, locale, 'data', this.content_type_uid, '_schema.json')
              fs.readFile(dataPath, 'utf8', (err, data) => {
                if (err) {
                    return reject(err)
                } else {
                  const finalRes = {
                    content_type_uid: this.content_type_uid,
                  }
                  if(!data){
                   return resolve(finalRes['content_type']=null)
                  }
                  let schema = JSON.parse(data)
                  finalRes['content_type']= schema
                  return resolve(finalRes)

                }
              })
            } 
            else {
              
                const dataPath = path.join(baseDir, locale, 'data', this.content_type_uid, 'index.json')
                if (!fs.existsSync(dataPath)) {
                    return reject(`${dataPath} didn't exist`)
                } else {
                    fs.readFile(dataPath, 'utf8', (err, data) => {
                        if (err) {
                            return reject(err)
                        } else {
                          const finalRes = {
                            content_type_uid: this.content_type_uid,
                            locale: locale,
                          }
                          let type = (this._entry == 'single') ? 'entry': 'entries'
                          if(!data){
                            if(type == "entry"){
                              finalRes[type]= null
                            }else{
                              finalRes[type]= []
                            }
                            return resolve(finalRes)
                           }
                            const entryData = JSON.parse(data)
                            result = map(entryData, 'data')
  
                            if (this._entry == 'single') {
                                result = find(result, { uid: this.entry_uid })
                                finalRes[type] = result
                                return resolve(finalRes)
                            }
                            if(this.single){
                              type="entry"
                              finalRes[type] = result[0]
                              return resolve(finalRes)
                            }
                            finalRes[type] = result
                            return resolve(finalRes)
                        }
                    })
                }
            }
        })
    }

    public findOne() {
      this.single = true
      return new Promise((resolve, reject) => {
          this.find().then((result) => {
              return resolve(result)
          }).catch((error) => {
              return reject(error)
          })
      })
  }

    
    public entry(uid) {
        const entry = query
        if (this.type == undefined) {
            throw new Error("Please call contentType('uid') first")
        }
        if (uid && typeof uid === 'string') {
            entry['entry_uid'] = uid
        }
        this._entry = 'single'
        return merge(this, entry)
    }

    
    public asset(uid) {
        this.type = 'asset'
        const asset = query
        if (uid && typeof uid === 'string') {
            asset['asset_uid'] = uid
            return merge(this, asset)
        }else{
            throw new Error('Please provide valid single asset uid')
        }
    }

    public assets() {
        this.type = 'asset'
        const asset = query
        return merge(asset, this)
    }

}
