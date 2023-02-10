import { CurrentType } from './data';

export const nullCurrent: CurrentType = {
    launchperiod: null,
    name: '空值对象'
}

export const valueCurrent: CurrentType = {
    name:"有值对象",
    launchperiod: "[{\"timeSpanList\":[{\"time\":\"00:00-02:00\",\"discount\":30},{\"time\":\"02:00-05:00\",\"discount\":0},{\"time\":\"05:00-10:00\",\"discount\":30},{\"time\":\"10:00-24:00\",\"discount\":\"50\"}]},{\"timeSpanList\":[{\"time\":\"00:00-02:00\",\"discount\":30},{\"time\":\"02:00-05:00\",\"discount\":0},{\"time\":\"05:00-10:00\",\"discount\":30},{\"time\":\"10:00-24:00\",\"discount\":\"50\"}]},{\"timeSpanList\":[{\"time\":\"00:00-02:00\",\"discount\":30},{\"time\":\"02:00-05:00\",\"discount\":0},{\"time\":\"05:00-10:00\",\"discount\":30},{\"time\":\"10:00-24:00\",\"discount\":\"50\"}]},{\"timeSpanList\":[{\"time\":\"00:00-02:00\",\"discount\":30},{\"time\":\"02:00-05:00\",\"discount\":0},{\"time\":\"05:00-10:00\",\"discount\":30},{\"time\":\"10:00-24:00\",\"discount\":\"50\"}]},{\"timeSpanList\":[{\"time\":\"00:00-02:00\",\"discount\":30},{\"time\":\"02:00-05:00\",\"discount\":0},{\"time\":\"05:00-10:00\",\"discount\":30},{\"time\":\"10:00-24:00\",\"discount\":\"50\"}]},{\"timeSpanList\":[{\"time\":\"00:00-02:00\",\"discount\":30},{\"time\":\"02:00-05:00\",\"discount\":0},{\"time\":\"05:00-10:00\",\"discount\":30},{\"time\":\"10:00-24:00\",\"discount\":\"50\"}]},{\"timeSpanList\":[{\"time\":\"00:00-02:00\",\"discount\":30},{\"time\":\"02:00-05:00\",\"discount\":0},{\"time\":\"05:00-10:00\",\"discount\":30},{\"time\":\"10:00-24:00\",\"discount\":\"50\"}]}]"

}