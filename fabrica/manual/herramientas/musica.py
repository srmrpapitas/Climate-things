# Música de fondo propia (sin copyright): pad suave + pulso de piano, 4 acordes en bucle.
import numpy as np, soundfile as sf, sys
sr=44100; bpm=84; beat=60/bpm; compas=4*beat
acordes=[[57,60,64],[53,57,60],[48,52,55],[55,59,62]]  # Am F C G
f=lambda m:440*2**((m-69)/12)
dur=compas*len(acordes)*4; n=int(dur*sr); t=np.arange(n)/sr; out=np.zeros(n)
for k in range(int(dur/compas)):
    ac=acordes[k%4]; a=int(k*compas*sr); b=int((k+1)*compas*sr); tt=t[a:b]-t[a]
    env=np.minimum(1,tt/0.8)*np.minimum(1,(compas-tt)/0.8)
    for m in ac:
        out[a:b]+=0.06*env*(np.sin(2*np.pi*f(m)*tt)+0.3*np.sin(2*np.pi*f(m)*2.003*tt))
    out[a:b]+=0.05*env*np.sin(2*np.pi*f(ac[0]-12)*tt)
    for j in range(8):  # corcheas de piano suaves
        s=a+int(j*beat/2*sr); L=int(0.6*sr); s2=min(s+L,n); tn=np.arange(s2-s)/sr
        nota=ac[[0,1,2,1,0,2,1,2][j]]+12
        out[s:s2]+=0.035*np.exp(-tn*5)*np.sin(2*np.pi*f(nota)*tn)
out=np.convolve(out,np.r_[1,np.zeros(int(.09*sr)),.25],'same')
out/=np.abs(out).max()*1.25
sf.write(sys.argv[1],np.c_[out,out],sr)
