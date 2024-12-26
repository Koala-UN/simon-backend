class ServiceInterface{
    constructor(){
        if (this.constructor === ServiceInterface) {
            throw new TypeError('Abstract class "ServiceInterface" cannot be instantiated directly');
          }
    }
    getAll(){
        throw new Error('You have to implement the method getAll!');
    }

}

module.exports = ServiceInterface;