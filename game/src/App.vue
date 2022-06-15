<template>
  <World>
    <Model
        :metalness-factor="1"
        :roughness-factor="0.4"
        :x="-3.53"
        :y="125.52"
        :z="216.5"
        :width="121.25"
        :depth="84.17"
        :scale-x="150"
        :scale-y="150"
        :scale-z="150"
        src="map.glb"
        physics="map"
    />
    <Dummy
      v-for="(dummyProxy,sessionId) in dummyProxyRecord"
      :key="sessionId"
      :proxy="dummyProxy"
      preset="rifle"
    />
    <ThirdPersonCamera
        :x="870.87"
        :y="-445.69"
        :z="2096.03"
        :rotation-x="-180"
        :rotation-z="-180"
        :rotation="-180"
        :inner-z="200"
        mouse-control-mode="orbit"
        active
        mouse-control
        :inner-x="20"
    >
      <Dummy
          :animations='{"idle":"https://unpkg.com/lingo3d-dummy@1.0.2/assets/rifle-idle.fbx","running":"https://unpkg.com/lingo3d-dummy@1.0.2/assets/rifle-running.fbx","runningBackwards":"https://unpkg.com/lingo3d-dummy@1.0.2/assets/rifle-running-backwards.fbx","jumping":"https://unpkg.com/lingo3d-dummy@1.0.2/assets/rifle-falling.fbx"}'
          animation="idle"
          pbr
          :x="870.87"
          :y="-445.69"
          :z="2096.03"
          :width="20"
          :depth="20"
          :scale-x="1.7"
          :scale-y="1.7"
          :scale-z="1.7"
          src="https://unpkg.com/lingo3d-dummy@1.0.2/assets/ybot.fbx"
          preset="rifle"
          ref="dummyRef"
          stride-move
          physics="character"
      >
        <Find name="mixamorigRightHand" :normal-scale='{"x":0,"y":0}'>
          <Model
              :x="-2628.69"
              :y="-575.04"
              :z="-141.17"
              :width="26.63"
              :depth="277.87"
              :scale-x="31.85"
              :scale-y="31.85"
              :scale-z="31.85"
              :rotation-x="-158.26"
              :rotation-y="-84.15"
              :rotation-z="105.98"
              :rotation="105.98"
              src="gun.glb"
          />
        </Find>
      </Dummy>
    </ThirdPersonCamera>
    <Setup default-light="studio" :default-light-scale="2" :exposure="0.7" />
  </World>

</template>
<script setup lang="ts">
import { World, Model,Find,Dummy,ThirdPersonCamera,Setup,keyboard,types} from "lingo3d-vue"
import {ref} from "vue";
import useColyseus from "./hooks/useColyseus";

const dummyRef = ref<types.Dummy>()

const dummyProxyRecord = useColyseus(dummyRef)

keyboard.onKeyPress=(_,pressed)=>{
  const dummy = dummyRef.value
  if (!dummy) return
  if(pressed.has('w')){
    dummy.strideForward = -5
  }
  if(pressed.has('s')){
    dummy.strideForward = 5
  }
  if(pressed.has('a')){
    dummy.strideRight = 5
  }
  if(pressed.has('d')){
    dummy.strideRight = -5
  }
}
keyboard.onKeyDown = (key)=>{
  const dummy = dummyRef.value
  if (!dummy) return
  if(key === 'Space'){
    dummy.jump(10)
  }
}
keyboard.onKeyUp=(_,pressed)=>{
  const dummy = dummyRef.value
  if (!dummy) return
  if(!pressed.has('w') && !pressed.has('s')){
    dummy.strideForward = 0
  }
  if(!pressed.has('a') && !pressed.has('d')){
    dummy.strideRight = 0
  }
}

</script>

