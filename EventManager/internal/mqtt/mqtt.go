package mqtt

import (
	"log"
	"time"
	"encoding/json"

	emqx "github.com/eclipse/paho.mqtt.golang"
)

type senzorPodatak struct {
	Id int32
	Vreme time.Time
	Temperatura float32
	VlaznostVazduha float32
	Pm2_5 float32
	Pm10 float32
}

const (
	TemperaturaGranica float32 = 70.0
	VlaznostVazduhaGranica float32 = 80.0
	Pm2_5Granica float32 = 100.0
	Pm10Granica float32 = 120.0
)

var messagePubHandler emqx.MessageHandler = func(client emqx.Client, msg emqx.Message) {
	log.Printf("Primljena poruka: %v sa topic-a: %s\n", msg.Payload(), msg.Topic())

	if msg.Topic() != "topic/NoviPodaci" {
		return
	}

	var podatak senzorPodatak

	if err := json.Unmarshal(msg.Payload(), &podatak); err != nil {
		log.Print("json.Unmarshal(): greška: ", err)
		return
	}

	if podatak.Temperatura > TemperaturaGranica {
		token := client.Publish("topic/IznadGranice/Temperatura", 0, false, msg.Payload())
		go func() {
			<- token.Done()
			if token.Error() != nil {
				log.Print("client.Publish(topic/IznadGranice/Temperatura) greška: ", token.Error())
			}
		}()
	}
	if podatak.VlaznostVazduha > VlaznostVazduhaGranica {
		token := client.Publish("topic/IznadGranice/VlaznostVazduha", 0, false, msg.Payload())
		go func() {
			<- token.Done()
			if token.Error() != nil {
				log.Print("client.Publish(topic/IznadGranice/VlaznostVazduha) greška: ", token.Error())
			}
		}()
	}
	if podatak.Pm2_5 > Pm2_5Granica {
		token := client.Publish("topic/IznadGranice/Pm2_5", 0, false, msg.Payload())
		go func() {
			<- token.Done()
			if token.Error() != nil {
				log.Print("client.Publish(topic/IznadGranice/Pm2_5) greška: ", token.Error())
			}
		}()
	}
	if podatak.Pm10 > Pm10Granica {
		token := client.Publish("topic/IznadGranice/Pm10", 0, false, msg.Payload())
		go func() {
			<- token.Done()
			if token.Error() != nil {
				log.Print("client.Publish(topic/IznadGranice/Pm10) greška: ", token.Error())
			}
		}()
	}
}

func NoviKlijent() emqx.Client {
	opts := emqx.NewClientOptions()
	opts.AddBroker("tcp://mqtt:1883")
	opts.SetClientID("iots_event_manager")
	opts.SetKeepAlive(5 * time.Second)

	opts.SetDefaultPublishHandler(messagePubHandler)

	klijent := emqx.NewClient(opts)
	if token := klijent.Connect(); token.Wait() && token.Error() != nil {
		log.Print("NoviKlijent(): greška: ", token.Error())
		return nil
	}

	return klijent
}
